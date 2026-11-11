export class ApiError extends Error {
    constructor(message, { status = 0, code = "unknown", fields = null } = {}) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.code = code;
        this.fields = fields;
    }
}
import { readDb } from "../data/mockDb.js";

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

export const api = {
    getJourney: (options) => mockGet(() => list(readDb().journey), options),
    getProjects: (options) => mockGet(() => list(readDb().projects), options),
    getProject: (id, options) =>
        mockGet(() => {
            const project = list(readDb().projects).find((p) => p.id === id);
            if (!project) throw new ApiError("Proyek tidak ditemukan.", { status: 404, code: "not_found" });
            return project;
        }, options),
    getCertificates: (options) => mockGet(() => list(readDb().certificates), options),
};
