import { ApiError, request, USE_MOCK } from "../../lib/api.js";
import { readDb, writeDb, resetDb } from "../../data/mockDb.js";
import {
  technologyFromApi,
  techLinkFromApi,
  iconFromApi,
  heroFromApi,
  heroToApi,
  footerTextFromApi,
  footerTextToApi,
  profileFromApi,
  profileToApi,
  journeyFromApi,
  journeyToApi,
  projectFromApi,
  projectToApi,
  certificateFromApi,
  certificateToApi,
  socialFromApi,
  socialToApi,
  isLink,
} from "../../lib/mappers.js";

export const UNAUTHORIZED_EVENT = "admin:unauthorized";
async function api(method, path, options) {
  try {
    return await request(method, path, options);
  } catch (error) {
    if (error.status === 401) window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    throw error;
  }
}

async function listAll(path, options) {
  const all = [];
  for (let page = 1; ; page++) {
    const result = await api("GET", `${path}?page=${page}&limit=50`, options);
    all.push(...(result.data ?? []));
    if (page >= (result.pagination?.total_pages ?? 1)) return all;
  }
}

const enc = encodeURIComponent;
const isNewId = (id) => typeof id !== "number";
const nextOrder = (items, key) => Math.max(0, ...items.map((x) => x[key] ?? 0)) + 1;

function syncTech(base, current, wanted, { bodyFor, changed }) {
  const wantedIds = new Set(wanted.map((t) => t.id));
  const currentById = new Map(current.map((t) => [t.id, t]));
  const jobs = [];
  for (const t of current) {
    if (!wantedIds.has(t.id)) jobs.push(api("DELETE", `${base}/${t.id}`));
  }
  wanted.forEach((t, index) => {
    const old = currentById.get(t.id);
    if (!old) jobs.push(api("POST", base, { body: { id_teknologi: t.id, ...bodyFor(t, index) } }));
    else if (changed(old, t, index)) jobs.push(api("PUT", `${base}/${t.id}`, { body: bodyFor(t, index) }));
  });
  return Promise.all(jobs);
}

function realOrderedCrud(path, fromApi, toApi) {
  const crud = {
    list: async (options) => (await listAll(path, options)).map(fromApi),
    create: async (item) => {
      const sortOrder = item.sortOrder || nextOrder(await crud.list(), "sortOrder");
      return fromApi(await api("POST", path, { body: toApi({ ...item, sortOrder }) }));
    },
    update: async (id, item) => fromApi(await api("PUT", `${path}/${enc(id)}`, { body: toApi(item) })),
    remove: (id) => api("DELETE", `${path}/${enc(id)}`),
    reorder: (items) =>
        Promise.all(
            items.map((item, index) =>
                item.sortOrder === index + 1 ? null : crud.update(item.id, { ...item, sortOrder: index + 1 }),
            ),
        ),
  };
  return crud;
}

const PROJECTS = "/admin/projects";

async function getProjectFull(id) {
  // GET /admin/projects/:id → { project: {...}, technologies: [...] }
  const { project, technologies } = await api("GET", `${PROJECTS}/${enc(id)}`);
  return projectFromApi(project, technologies);
}

async function saveProjectTech(id, current, wanted) {
  await syncTech(`${PROJECTS}/${id}/technologies`, current, wanted, {
    bodyFor: (t) => ({ kategori: t.role?.trim() || "Lainnya" }),
    changed: (old, t) => (old.role || "") !== (t.role?.trim() || "Lainnya"),
  });
}

const realProjects = {
  list: async (options) => {
    const projects = await listAll(PROJECTS, options);
    const techs = await Promise.all(
        projects.map((p) => api("GET", `${PROJECTS}/${p.id_proyek}/technologies`, options).then((r) => r.data ?? [])),
    );
    return projects.map((p, i) => projectFromApi(p, techs[i]));
  },
  create: async (item) => {
    const priority = item.priority ?? nextOrder(await realProjects.list(), "priority");
    const created = await api("POST", PROJECTS, { body: projectToApi({ ...item, priority }) });
    await saveProjectTech(created.id_proyek, [], item.tech ?? []);
    return getProjectFull(created.id_proyek);
  },
  update: async (id, item) => {
    const { technologies } = await api("PUT", `${PROJECTS}/${enc(id)}`, { body: projectToApi(item) });
    await saveProjectTech(id, technologies.map(techLinkFromApi), item.tech ?? []);
    return getProjectFull(id);
  },
  remove: (id) => api("DELETE", `${PROJECTS}/${enc(id)}`),
  reorder: (items) =>
      Promise.all(
          items.map((item, index) =>
              item.priority === index + 1 ? null : api("PUT", `${PROJECTS}/${item.id}`, { body: projectToApi({ ...item, priority: index + 1 }) }),
          ),
      ),
};

async function saveContent(changes) {
  const current = await api("GET", "/admin/content");
  const body = { ...heroToApi(heroFromApi(current)), ...footerTextToApi(footerTextFromApi(current)), ...changes };
  return api("PUT", "/admin/content", { body });
}

const listSocials = async () =>
    ((await api("GET", "/admin/social-links")).data ?? []).map(socialFromApi);

async function getFooter(options) {
  const [content, socials] = await Promise.all([api("GET", "/admin/content", options), listSocials()]);
  return { ...footerTextFromApi(content), socials };
}

async function getProfile(options) {
  const [profile, techs] = await Promise.all([
    api("GET", "/admin/profile", options),
    api("GET", "/admin/profile/technologies", options),
  ]);
  return { ...profileFromApi(profile), tech: (techs.data ?? []).map(techLinkFromApi) };
}

const realAdminApi = {
  auth: {
    me: (options) => request("GET", "/auth/me", options),
    login: (username, password) => request("POST", "/auth/login", { body: { username, password } }),
    logout: () => request("POST", "/auth/logout"),
  },

  getSummary: async (options) => {
    const d = await api("GET", "/admin/dashboard", options);
    return { hero: 1, profile: 1, journey: d.experiences, projects: d.projects, certificates: d.certificates, footer: d.social_links };
  },

  getHero: async (options) => heroFromApi(await api("GET", "/admin/content", options)),
  saveHero: async (hero) => heroFromApi(await saveContent(heroToApi(hero))),

  getFooter,
  saveFooter: async (footer) => {
    await saveContent(footerTextToApi(footer));
    const current = await listSocials();
    const wanted = footer.socials.map((s, index) => ({ ...s, sortOrder: index + 1 }));
    const keep = new Set(wanted.filter((s) => !isNewId(s.id)).map((s) => s.id));
    const currentById = new Map(current.map((s) => [s.id, s]));
    // Berurutan (bukan Promise.all), supaya pesan error yang muncul jelas milik baris mana.
    for (const s of current) if (!keep.has(s.id)) await api("DELETE", `/admin/social-links/${s.id}`);
    for (const s of wanted) {
      const body = socialToApi(s);
      if (isNewId(s.id)) await api("POST", "/admin/social-links", { body });
      else if (JSON.stringify(socialToApi(currentById.get(s.id))) !== JSON.stringify(body)) {
        await api("PUT", `/admin/social-links/${s.id}`, { body });
      }
    }
    return getFooter();
  },

  getProfile,
  saveProfile: async (profile) => {
    await api("PUT", "/admin/profile", { body: profileToApi(profile) });
    const current = (await getProfile()).tech;
    await syncTech("/admin/profile/technologies", current, profile.tech ?? [], {
      bodyFor: (_, index) => ({ prioritas: index + 1 }),
      changed: (old, t, index) => current.indexOf(old) !== index,
    });
    return getProfile();
  },

  journey: realOrderedCrud("/admin/experiences", journeyFromApi, journeyToApi),
  projects: realProjects,
  certificates: realOrderedCrud("/admin/certificates", certificateFromApi, certificateToApi),

  technologies: {
    list: async (options) => ((await api("GET", "/admin/technologies", options)).data ?? []).map(technologyFromApi),
    create: async ({ name, iconUrl }) => {
      let iconId = null;
      if (iconUrl) {
        const icon = await api("POST", "/admin/icons", { body: { nama_ikon: name, url_ikon: iconUrl, kategori_ikon: "teknologi" } });
        iconId = icon.id_ikon;
      }
      const created = await api("POST", "/admin/technologies", { body: { nama_teknologi: name, id_ikon: iconId } });
      return { ...technologyFromApi(created), iconUrl: iconUrl || null };
    },
  },

  icons: {
    list: async (category) =>
        ((await api("GET", `/admin/icons?category=${enc(category)}`)).data ?? []).map(iconFromApi),
    create: async ({ name, url, category }) =>
        iconFromApi(await api("POST", "/admin/icons", { body: { nama_ikon: name, url_ikon: url, kategori_ikon: category } })),
  },

  upload: async (file, purpose) => {
    const form = new FormData();
    form.append("file", file);
    form.append("purpose", purpose);
    const { url } = await api("POST", "/admin/uploads", { body: form });
    return { url };
  },

  resetMock: null, // hanya ada di versi mock
};

const MOCK_DELAY_MS = 300;

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

const badRequest = (message) => new ApiError(message, { status: 400, code: "bad_request" });
const isHttpUrl = (v) => !v || /^https?:\/\/[^\s/]+/i.test(v);

const VALIDATE = {
  journey: (j) => {
    if (!j.org?.trim()) throw badRequest("Institusi wajib diisi");
    if (!j.kind) throw badRequest("Kategori perjalanan tidak valid");
    if (!/^\d{4}-\d{2}$/.test(j.startDate ?? "")) throw badRequest("Tanggal mulai wajib menggunakan format YYYY-MM-DD");
    if (j.endDate && j.endDate < j.startDate) throw badRequest("Tanggal selesai tidak boleh sebelum tanggal mulai");
  },
  projects: (p) => {
    if (!p.title?.trim()) throw badRequest("Judul proyek wajib diisi");
    if (!p.category) throw badRequest("Kategori proyek tidak valid");
    if (!p.status) throw badRequest("Status proyek tidak valid");
    if (!isHttpUrl(p.demoUrl) || !isHttpUrl(p.githubUrl)) throw badRequest("URL demo/GitHub harus HTTP atau HTTPS");
  },
  certificates: (c) => {
    if (!c.title?.trim() || !c.issuer?.trim()) throw badRequest("Nama sertifikat dan penerbit wajib diisi");
    if (c.expiresAt && c.issuedAt && c.expiresAt < c.issuedAt) throw badRequest("Tanggal kadaluarsa tidak boleh sebelum tanggal terbit");
    if (!isHttpUrl(c.credentialUrl)) throw badRequest("URL sertifikat harus HTTP atau HTTPS");
  },
  hero: (h) => {
    if (!h.displayName?.trim() || !h.headline?.trim()) throw badRequest("Nama tampilan dan judul utama wajib diisi");
    if (!isLink(h.ctaUrl)) throw badRequest("URL CTA harus berupa https://..., #bagian, /path, atau mailto:email");
  },
  profile: (p) => {
    if (!p.fullName?.trim()) throw badRequest("Nama lengkap wajib diisi");
  },
  footer: (f) => {
    for (const s of f.socials) {
      if (!s.platform?.trim() || !s.label?.trim()) throw badRequest("Nama platform dan nama akun wajib diisi");
      if (!s.url || !isLink(s.url)) throw badRequest("URL tujuan harus berupa https://..., #bagian, /path, atau mailto:email");
    }
  },
};

const nextId = (items) => Math.max(0, ...items.map((x) => (typeof x.id === "number" ? x.id : 0))) + 1;
const notFound = () => new ApiError("Data tidak ditemukan", { status: 404, code: "not_found" });
const byKey = (key) => (a, b) => (a[key] ?? 0) - (b[key] ?? 0);

function mockCrud(resource, orderKey) {
  const crud = {
    list: async (options) => {
      await delay(options);
      return structuredClone(readDb()[resource]).sort(byKey(orderKey));
    },
    create: async (item) => {
      await delay();
      VALIDATE[resource](item);
      const db = readDb();
      const created = { ...item, id: nextId(db[resource]), [orderKey]: item[orderKey] || nextOrder(db[resource], orderKey) };
      writeDb({ ...db, [resource]: [...db[resource], created] });
      return structuredClone(created);
    },
    update: async (id, item) => {
      await delay();
      VALIDATE[resource](item);
      const db = readDb();
      if (!db[resource].some((x) => x.id === id)) throw notFound();
      const updated = { ...item, id };
      writeDb({ ...db, [resource]: db[resource].map((x) => (x.id === id ? updated : x)) });
      return structuredClone(updated);
    },
    remove: async (id) => {
      await delay();
      const db = readDb();
      if (!db[resource].some((x) => x.id === id)) throw notFound();
      writeDb({ ...db, [resource]: db[resource].filter((x) => x.id !== id) });
      return null;
    },
    reorder: async (items) => {
      await delay();
      const db = readDb();
      const order = new Map(items.map((x, index) => [x.id, index + 1]));
      writeDb({ ...db, [resource]: db[resource].map((x) => ({ ...x, [orderKey]: order.get(x.id) ?? x[orderKey] })) });
      return null;
    },
  };
  return crud;
}

function mockDoc(resource, prepare = (x) => x) {
  return {
    get: async (options) => {
      await delay(options);
      return structuredClone(readDb()[resource]);
    },
    save: async (doc) => {
      await delay();
      VALIDATE[resource](doc);
      const saved = prepare(structuredClone(doc));
      writeDb({ ...readDb(), [resource]: saved });
      return structuredClone(saved);
    },
  };
}

const UPLOAD_TYPES = ["image/png", "image/jpeg", "image/webp"]; // sama dengan backend: tanpa SVG
const UPLOAD_MAX_BYTES = 5 * 1024 * 1024;

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new ApiError("File tidak dapat dibaca", { code: "upload_failed" }));
    reader.readAsDataURL(file);
  });
}

const hero = mockDoc("hero");
const profile = mockDoc("profile");
const footer = mockDoc("footer", (doc) => {
  let id = nextId(readDb().footer.socials);
  doc.socials = doc.socials.map((s, index) => ({ ...s, id: isNewId(s.id) ? id++ : s.id, sortOrder: index + 1 }));
  return doc;
});

const mockAdminApi = {
  auth: {
    me: async () => ({ username: "admin (data contoh)" }),
    login: async () => ({ message: "Login berhasil" }),
    logout: async () => null,
  },

  getSummary: async (options) => {
    await delay(options);
    const db = readDb();
    return { hero: 1, profile: 1, journey: db.journey.length, projects: db.projects.length, certificates: db.certificates.length, footer: db.footer.socials.length };
  },

  getHero: hero.get,
  saveHero: hero.save,
  getProfile: profile.get,
  saveProfile: profile.save,
  getFooter: footer.get,
  saveFooter: footer.save,

  journey: mockCrud("journey", "sortOrder"),
  projects: mockCrud("projects", "priority"),
  certificates: mockCrud("certificates", "sortOrder"),

  technologies: {
    list: async (options) => {
      await delay(options);
      return structuredClone(readDb().technologies);
    },
    create: async ({ name, iconUrl }) => {
      await delay();
      const db = readDb();
      if (!name?.trim()) throw badRequest("Nama teknologi wajib diisi");
      if (db.technologies.some((t) => t.name.toLowerCase() === name.trim().toLowerCase())) {
        throw new ApiError("Nama teknologi sudah digunakan", { status: 409, code: "conflict" });
      }
      const created = { id: nextId(db.technologies), name: name.trim(), iconId: null, iconUrl: iconUrl || null };
      writeDb({ ...db, technologies: [...db.technologies, created] });
      return created;
    },
  },

  icons: {
    list: async () => {
      await delay();
      return structuredClone(readDb().icons ?? []);
    },
    create: async ({ name, url, category }) => {
      await delay();
      const db = readDb();
      const icons = db.icons ?? [];
      const created = { id: nextId(icons), name, url, category };
      writeDb({ ...db, icons: [...icons, created] });
      return created;
    },
  },

  upload: async (file) => {
    await delay();
    if (!UPLOAD_TYPES.includes(file.type)) throw badRequest("Hanya gambar JPEG, PNG, dan WebP yang diterima");
    if (file.size > UPLOAD_MAX_BYTES) throw badRequest("Ukuran file tidak valid atau melebihi batas");
    return { url: await readAsDataUrl(file) };
  },

  resetMock: async () => {
    await delay();
    resetDb();
    return null;
  },
};

export const adminApi = USE_MOCK ? mockAdminApi : realAdminApi;
export const isMockMode = USE_MOCK;
