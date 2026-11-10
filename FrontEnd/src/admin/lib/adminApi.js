import { ApiError } from "../../lib/api.js";
import { readDb, writeDb, resetDb } from "../../data/mockDb.js";

const USE_MOCK = true;

const BASE_URL = import.meta.env.VITE_API_URL || "/api";
async function request(method, path, { body, signal } = {}) {
  const isFile = body instanceof FormData;
  const headers = { Accept: "application/json" };

  if (body !== undefined && !isFile) headers["Content-Type"] = "application/json";

  let response;
  try {
    response = await fetch(`${BASE_URL}/admin${path}`, {
      method,
      signal,
      headers,
      credentials: "include",
      body: body === undefined ? undefined : isFile ? body : JSON.stringify(body),
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError("Tidak bisa terhubung ke server.", { code: "network_error" });
  }

  if (response.status === 204) return null;

  const json = await response.json().catch((error) => {
    if (error.name === "AbortError") throw error;
    return null;
  });

  if (!response.ok) {
    if (!json && [502, 503, 504].includes(response.status)) {
      throw new ApiError("Tidak bisa terhubung ke server.", { status: response.status, code: "network_error" });
    }
    throw new ApiError(json?.error?.message ?? `Server error (${response.status}).`, {
      status: response.status,
      code: json?.error?.code ?? (response.status >= 500 ? "server_error" : "unknown"),
      fields: json?.error?.fields ?? null,
    });
  }

  if (json?.data === undefined) {
    throw new ApiError("Respons server tidak valid.", { status: response.status, code: "invalid_response" });
  }
  return json.data;
}

const enc = encodeURIComponent;

function realCrud(path) {
  return {
    list: (options) => request("GET", path, options),
    create: (item) => request("POST", path, { body: item }),
    update: (id, item) => request("PUT", `${path}/${enc(id)}`, { body: item }),
    remove: (id) => request("DELETE", `${path}/${enc(id)}`),
    reorder: (ids) => request("PUT", `${path}/order`, { body: { ids } }),
  };
}

const realAdminApi = {
  getSummary: (options) => request("GET", "/summary", options),

  getHero: (options) => request("GET", "/hero", options),
  saveHero: (hero) => request("PUT", "/hero", { body: hero }),
  getProfile: (options) => request("GET", "/profile", options),
  saveProfile: (profile) => request("PUT", "/profile", { body: profile }),
  getFooter: (options) => request("GET", "/footer", options),
  saveFooter: (footer) => request("PUT", "/footer", { body: footer }),

  journey: realCrud("/journey"),
  projects: realCrud("/projects"),
  certificates: realCrud("/certificates"),

  upload: (file) => {
    const form = new FormData();
    form.append("file", file);
    return request("POST", "/uploads", { body: form });
  },

  resetMock: null,
};

const MOCK_DELAY_MS = 400;

function delay({ signal } = {}) {
  return new Promise((resolve, reject) => {
    const abortError = () => new DOMException("Request dibatalkan.", "AbortError");
    if (signal?.aborted) return reject(abortError());
    const timer = setTimeout(resolve, MOCK_DELAY_MS);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(abortError());
      },
      { once: true },
    );
  });
}
const REQUIRED = {
  journey: { title: "Judul", org: "Organisasi", kind: "Kategori", startDate: "Tanggal mulai" },
  projects: { title: "Judul proyek", category: "Kategori" },
  certificates: { title: "Nama sertifikat", issuer: "Organisasi penerbit", issuedAt: "Tanggal terbit" },
  hero: { displayName: "Nama tampilan" },
  profile: { fullName: "Nama lengkap" },
  footer: {},
};

function validate(resource, item) {
  const fields = {};
  for (const [key, label] of Object.entries(REQUIRED[resource])) {
    if (!String(item[key] ?? "").trim()) fields[key] = `${label} wajib diisi.`;
  }
  if (Object.keys(fields).length > 0) {
    throw new ApiError("Periksa kembali isian yang ditandai.", { status: 400, code: "bad_request", fields });
  }
}

function makeId(title) {
  const slug = String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `${slug || "item"}-${Math.random().toString(36).slice(2, 6)}`;
}

const notFound = () => new ApiError("Data tidak ditemukan.", { status: 404, code: "not_found" });

function mockCrud(resource) {
  return {
    list: async (options) => {
      await delay(options);
      return structuredClone(readDb()[resource]);
    },
    create: async (item) => {
      await delay();
      validate(resource, item);
      const db = readDb();
      const created = { ...item, id: makeId(item.title) };
      writeDb({ ...db, [resource]: [...db[resource], created] });
      return created;
    },
    update: async (id, item) => {
      await delay();
      validate(resource, item);
      const db = readDb();
      if (!db[resource].some((x) => x.id === id)) throw notFound();
      const updated = { ...item, id }; // id dari URL yang menang, bukan dari body
      writeDb({ ...db, [resource]: db[resource].map((x) => (x.id === id ? updated : x)) });
      return updated;
    },
    remove: async (id) => {
      await delay();
      const db = readDb();
      if (!db[resource].some((x) => x.id === id)) throw notFound();
      writeDb({ ...db, [resource]: db[resource].filter((x) => x.id !== id) });
      return null;
    },
    reorder: async (ids) => {
      await delay();
      const db = readDb();
      const byId = new Map(db[resource].map((x) => [x.id, x]));
      if (ids.length !== byId.size || ids.some((id) => !byId.has(id))) {
        throw new ApiError("Daftar id tidak cocok.", { status: 400, code: "bad_request" });
      }
      const ordered = ids.map((id) => byId.get(id));
      writeDb({ ...db, [resource]: ordered });
      return structuredClone(ordered);
    },
  };
}

function mockDoc(resource) {
  return {
    get: async (options) => {
      await delay(options);
      return structuredClone(readDb()[resource]);
    },
    save: async (doc) => {
      await delay();
      validate(resource, doc);
      writeDb({ ...readDb(), [resource]: doc });
      return structuredClone(doc);
    },
  };
}

const UPLOAD_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const UPLOAD_MAX_BYTES = 2 * 1024 * 1024; // 2 MB, samakan dengan batas di backend

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new ApiError("Gagal membaca file.", { code: "upload_failed" }));
    reader.readAsDataURL(file);
  });
}

const hero = mockDoc("hero");
const profile = mockDoc("profile");
const footer = mockDoc("footer");

const mockAdminApi = {
  getSummary: async (options) => {
    await delay(options);
    const db = readDb();
    return {
      hero: 1,
      profile: 1,
      journey: db.journey.length,
      projects: db.projects.length,
      certificates: db.certificates.length,
      footer: 1,
    };
  },

  getHero: hero.get,
  saveHero: hero.save,
  getProfile: profile.get,
  saveProfile: profile.save,
  getFooter: footer.get,
  saveFooter: footer.save,

  journey: mockCrud("journey"),
  projects: mockCrud("projects"),
  certificates: mockCrud("certificates"),

  upload: async (file) => {
    await delay();
    if (!UPLOAD_TYPES.includes(file.type)) {
      throw new ApiError("Format file harus PNG, JPG, WEBP, atau SVG.", { status: 400, code: "bad_request" });
    }
    if (file.size > UPLOAD_MAX_BYTES) {
      throw new ApiError("Ukuran file maksimal 2 MB.", { status: 400, code: "bad_request" });
    }
    return { url: await readAsDataUrl(file) };
  },

  // Kembalikan semua data contoh ke awal (hanya ada di mode mock).
  resetMock: async () => {
    await delay();
    resetDb();
    return null;
  },
};

export const adminApi = USE_MOCK ? mockAdminApi : realAdminApi;
export const isMockMode = USE_MOCK;
