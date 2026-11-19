import {
    mockJourney,
    mockProjects,
    mockCertificates,
    mockHero,
    mockProfile,
    mockFooter,
    mockTechnologies,
} from "./mock.js";

const STORAGE_KEY = "portfolio-mock-db-v3";

function seed() {
    return structuredClone({
        hero: mockHero,
        profile: mockProfile,
        footer: mockFooter,
        journey: mockJourney,
        projects: mockProjects,
        certificates: mockCertificates,
        technologies: mockTechnologies,
    });
}

let memory = null;

export function readDb() {
    if (memory) return memory;
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        memory = saved ? JSON.parse(saved) : seed();
    } catch {
        memory = seed();
    }
    return memory;
}

export function writeDb(db) {
    memory = db;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {
        // Penuh (misalnya karena gambar besar) atau diblokir: biarkan di memori saja.
    }
}

export function resetDb() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // abaikan
    }
    memory = seed();
    return memory;
}
