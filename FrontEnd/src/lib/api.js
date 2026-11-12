import { readDb } from "../data/mockDb.js";
import { journeyFromApi, projectFromApi, journeyToPublic, projectToPublic } from "./mappers.js";

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export class ApiError extends Error {
    constructor(message, { status = 0, code = "unknown", fields = null } = {}) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.code = code;
        this.fields = fields;
    }
}

function errorMessage(body, status) {
    if (body?.message) return body.message;
    if (typeof body?.error === "string") return body.error;
    if (body?.error?.message) return body.error.message;
    return `Server error (${status}).`;
}

export async function request(method, path, { body, signal } = {}) {
    const isFile = body instanceof FormData;
    const headers = { Accept: "application/json" };

    if (body !== undefined && !isFile) headers["Content-Type"] = "application/json";
    let response;
    try {
        response = await fetch(`${BASE_URL}${path}`, {
            method,
            signal,
            headers,
            credentials: "include",
            body: body === undefined ? undefined : isFile ? body : JSON.stringify(body),
        });
    } catch (error) {
        if (error.name === "AbortError") throw error; // sengaja kita batalkan
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
        throw new ApiError(errorMessage(json, response.status), {
            status: response.status,
            code: response.status === 401 ? "unauthorized" : typeof json?.error === "string" ? json.error : "unknown",
        });
    }
    if (json === null) {
        throw new ApiError("Respons server tidak valid.", { status: response.status, code: "invalid_response" });
    }
    return json;
}

async function getPortfolio(options) {
    return request("GET", "/public/portfolio", options);
}

const realApi = {
    getJourney: async (options) => {
        const portfolio = await getPortfolio(options);
        return (portfolio.experiences ?? []).map(journeyFromApi).map(journeyToPublic);
    },
    getProjects: async (options) => {
        const portfolio = await getPortfolio(options);
        return (portfolio.projects ?? [])
            .map(({ project, technologies }) => projectFromApi(project, technologies))
            .map(projectToPublic);
    },
    getProject: async (id, options) => {
        const projects = await realApi.getProjects(options);
        const project = projects.find((p) => p.id === String(id));
        if (!project) throw new ApiError("Proyek tidak ditemukan.", { status: 404, code: "not_found" });
        return project;
    },
};

const MOCK_MODE = "normal";
const MOCK_DELAY_MS = 800;

function mockGet(getData, { signal } = {}) {
    return new Promise((resolve, reject) => {
        const abortError = () => new DOMException("Request dibatalkan.", "AbortError");
        if (signal?.aborted) return reject(abortError());

        const timer = setTimeout(() => {
            signal?.removeEventListener("abort", onAbort);
            if (MOCK_MODE === "error") {
                return reject(new ApiError("Tidak bisa terhubung ke server.", { code: "network_error" }));
            }
            try {
                resolve(getData());
            } catch (error) {
                reject(error);
            }
        }, MOCK_DELAY_MS);

        function onAbort() {
            clearTimeout(timer);
            reject(abortError());
        }
        signal?.addEventListener("abort", onAbort, { once: true });
    });
}

const list = (items) => (MOCK_MODE === "empty" ? [] : items);

const mockApi = {
    getJourney: (options) => mockGet(() => list(readDb().journey).map(journeyToPublic), options),
    getProjects: (options) => mockGet(() => list(readDb().projects).map(projectToPublic), options),
    getProject: (id, options) =>
        mockGet(() => {
            const projects = list(readDb().projects).map(projectToPublic);
            const project = projects.find((p) => p.id === String(id));
            if (!project) throw new ApiError("Proyek tidak ditemukan.", { status: 404, code: "not_found" });
            return project;
        }, options),
};

export const api = USE_MOCK ? mockApi : realApi;
