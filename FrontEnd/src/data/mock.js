export const mockTechnologies = [
    { id: 1, name: "React", iconId: null, iconUrl: null },
    { id: 2, name: "Node.js", iconId: null, iconUrl: null },
    { id: 3, name: "TypeScript", iconId: null, iconUrl: null },
    { id: 4, name: "PostgreSQL", iconId: null, iconUrl: null },
];
const [react, node, ts, pg] = mockTechnologies;

export const mockJourney = [
    {
        id: 1,
        title: "[Senior Fullstack Engineer]",
        org: "[Nama Perusahaan]",
        kind: "pekerjaan",
        startDate: "2022-01",
        endDate: null,
        description:
            "Memimpin tim fitur lintas frontend, backend, dan sistem desain sambil menjaga kualitas kode dan kolaborasi yang efektif.",
        sortOrder: 1,
    },
    {
        id: 2,
        title: "[Fullstack Developer]",
        org: "[Perusahaan Sebelumnya]",
        kind: "pekerjaan",
        startDate: "2019-06",
        endDate: "2021-12",
        description:
            "Membangun antarmuka responsif, REST API, dan pipeline data sambil bekerja sama erat dengan mitra produk dan desain.",
        sortOrder: 2,
    },
    {
        id: 3,
        title: "[Sarjana Ilmu Komputer]",
        org: "[Nama Universitas]",
        kind: "pendidikan",
        startDate: "2015-08",
        endDate: "2019-06",
        description: "Berfokus pada rekayasa perangkat lunak, desain sistem, dan komputasi berpusat pada manusia.",
        sortOrder: 3,
    },
    {
        id: 4,
        title: "[Bootcamp / Kursus Online]",
        org: "[Nama Program]",
        kind: "pelatihan",
        startDate: "2018-01",
        endDate: "2018-04",
        description: "",
        sortOrder: 4,
    },
];

export const mockProjects = [
    {
        id: 1,
        title: "[Nama Proyek]",
        category: "UI/UX",
        status: "konsep",
        imageUrl: "/images/project-1.webp",
        summary:
            "Ruang kerja konseptual yang menyeimbangkan tugas admin dengan fokus kreatif dan struktur produk yang matang.",
        date: "2025-03",
        demoUrl: "",
        githubUrl: "https://github.com/username/repository",
        priority: 1,
        tech: [{ ...react, role: "Frontend" }, { ...node, role: "Backend" }],
    },
    {
        id: 2,
        title: "[Nama Proyek]",
        category: "Website",
        status: "on-going",
        imageUrl: "/images/project-2.webp",
        summary: "Deskripsi singkat proyek: masalah yang diselesaikan, peran kamu, dan hasilnya.",
        date: "2025-01",
        demoUrl: "",
        githubUrl: "https://github.com/username/repository",
        priority: 2,
        tech: [{ ...react, role: "Frontend" }, { ...ts, role: "Frontend" }],
    },
    {
        id: 3,
        title: "[Nama Proyek]",
        category: "Website",
        status: "finished",
        imageUrl: "/images/project-3.webp",
        summary: "Deskripsi singkat proyek: masalah yang diselesaikan, peran kamu, dan hasilnya.",
        date: "2024-09",
        demoUrl: "",
        githubUrl: "https://github.com/username/repository",
        priority: 3,
        tech: [{ ...node, role: "Backend" }, { ...pg, role: "Database" }],
    },
];

export const mockCertificates = [1, 2, 3].map((n, i) => ({
    id: n,
    title: "[Judul Sertifikasi]",
    issuer: "[Penerbit]",
    issuedAt: ["2026-03-14", "2025-11-02", "2025-06-20"][i],
    expiresAt: null,
    credentialId: "",
    credentialUrl: "",
    description: "Placeholder untuk penerbit, tanggal penyelesaian, dan deskripsi singkat tentang kredensial.",
    sortOrder: n,
}));

export const mockHero = {
    displayName: "[Nama Full]",
    roleLabel: "FULLSTACK DEVELOPER",
    headline: "Bangun dan luncurkan.",
    heroText: "",
    supportText: "",
    extraText: "Akademik × PTI",
    description:
        "Saya membantu tim meluncurkan produk yang kuat dan mudah dikelola — memadukan pemikiran produk, kejelasan visual, dan pemecahan masalah berbasis kode.",
    ctaLabel: "Jelajahi proyek",
    ctaUrl: "#proyek",
};

export const mockProfile = {
    photoUrl: "/images/profile.jpg",
    fullName: "[Nama Full]",
    role: "Fullstack Developer",
    location: "[Kota, Provinsi]",
    email: "email@contoh.com",
    bio: "Sedikit niat di setiap interaksi.",
    about:
        "Saya bermitra dengan tim untuk mengubah ide produk menjadi pengalaman yang dipoles dan mudah dikelola. Pendekatan saya menyeimbangkan kejelasan visual, kelayakan teknis, dan kolaborasi yang efektif.",
    tech: [react, ts, node],
};

export const mockFooter = {
    description: "sedikit rasa ingin tahu membawa jauh",
    copyright: "© 2026 [Nama Full]",
    extraText: "",
    socials: [
        { id: 1, platform: "LinkedIn", label: "@namaakun", url: "https://linkedin.com/in/namaakun", iconId: null, iconUrl: null, sortOrder: 1 },
        { id: 2, platform: "CV", label: "Buka / unduh CV", url: "/cv.pdf", iconId: null, iconUrl: null, sortOrder: 2 },
        { id: 3, platform: "Instagram", label: "@namaakun", url: "https://instagram.com/namaakun", iconId: null, iconUrl: null, sortOrder: 3 },
    ],
};
