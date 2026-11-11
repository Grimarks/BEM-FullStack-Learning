export const mockJourney = [
    {
        id: "senior-fullstack",
        kind: "Pekerjaan",
        title: "[Senior Fullstack Engineer]",
        org: "[Nama Perusahaan]",
        startDate: "2022-01",
        endDate: null,
        extra: "",
        description:
            "Memimpin tim fitur lintas frontend, backend, dan sistem desain sambil menjaga kualitas kode dan kolaborasi yang efektif.",
    },
    {
        id: "fullstack-dev",
        kind: "Pekerjaan",
        title: "[Fullstack Developer]",
        org: "[Perusahaan Sebelumnya]",
        startDate: "2019-06",
        endDate: "2021-12",
        extra: "",
        description:
            "Membangun antarmuka responsif, REST API, dan pipeline data sambil bekerja sama erat dengan mitra produk dan desain.",
    },
    {
        id: "sarjana",
        kind: "Pendidikan",
        title: "[Sarjana Ilmu Komputer]",
        org: "[Nama Universitas]",
        startDate: "2015-08",
        endDate: "2019-06",
        extra: "",
        description: "Berfokus pada rekayasa perangkat lunak, desain sistem, dan komputasi berpusat pada manusia.",
    },
    {
        id: "bootcamp",
        kind: "Kursus",
        title: "[Bootcamp / Kursus Online]",
        org: "[Nama Program]",
        startDate: "2018-01",
        endDate: "2018-04",
        extra: "",
    },
];

const react = { id: "react", name: "React", iconKey: "react", iconUrl: null };
const node = { id: "nodejs", name: "Node.js", iconKey: "nodejs", iconUrl: null };
const ts = { id: "typescript", name: "TypeScript", iconKey: "typescript", iconUrl: null };
const pg = { id: "postgresql", name: "PostgreSQL", iconKey: "postgresql", iconUrl: null };

export const mockProjects = [
    {
        id: "proyek-1",
        title: "[Nama Proyek]",
        category: "[Kategori]",
        categoryLong: "Desain Produk / Aplikasi Web",
        status: "Konsep",
        imageUrl: "/images/project-1.webp",
        summary:
            "Ruang kerja konseptual yang menyeimbangkan tugas admin dengan fokus kreatif dan struktur produk yang matang.",
        date: "2025-03",
        demoUrl: "",
        githubUrl: "https://github.com/[username]/[repository]",
        tech: [react, node],
        links: [],
    },
    {
        id: "proyek-2",
        title: "[Nama Proyek]",
        category: "[Kategori]",
        categoryLong: "Aplikasi Web",
        status: "Berjalan",
        imageUrl: "/images/project-2.webp",
        summary: "Deskripsi singkat proyek: masalah yang diselesaikan, peran kamu, dan hasilnya.",
        date: "2025-01",
        demoUrl: "",
        githubUrl: "https://github.com/[username]/[repository]",
        tech: [react, ts],
        links: [],
    },
    {
        id: "proyek-3",
        title: "[Nama Proyek]",
        category: "[Kategori]",
        categoryLong: "API / Backend",
        status: "Selesai",
        imageUrl: "/images/project-3.webp",
        summary: "Deskripsi singkat proyek: masalah yang diselesaikan, peran kamu, dan hasilnya.",
        date: "2024-09",
        demoUrl: "",
        githubUrl: "https://github.com/[username]/[repository]",
        tech: [node, pg],
        links: [],
    },
];

export const mockCertificates = [
    {
        id: "sertifikat-1",
        title: "[Judul Sertifikasi]",
        issuer: "[Penerbit]",
        issuedAt: "2026-03-14",
        expiresAt: null,
        credentialId: "",
        credentialUrl: "",
        imageUrl: "/images/certificate-placeholder.svg",
        description: "Placeholder untuk penerbit, tanggal penyelesaian, dan deskripsi singkat tentang kredensial.",
    },
    {
        id: "sertifikat-2",
        title: "[Judul Sertifikasi]",
        issuer: "[Penerbit]",
        issuedAt: "2025-11-02",
        expiresAt: null,
        credentialId: "",
        credentialUrl: "",
        imageUrl: "/images/certificate-placeholder.svg",
        description: "Placeholder untuk penerbit, tanggal penyelesaian, dan deskripsi singkat tentang kredensial.",
    },
    {
        id: "sertifikat-3",
        title: "[Judul Sertifikasi]",
        issuer: "[Penerbit]",
        issuedAt: "2025-06-20",
        expiresAt: null,
        credentialId: "",
        credentialUrl: "",
        imageUrl: "/images/certificate-placeholder.svg",
        description: "Placeholder untuk penerbit, tanggal penyelesaian, dan deskripsi singkat tentang kredensial.",
    },
];

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
    skills: ["Pemikiran Produk", "Pengembangan Frontend", "Pengembangan Backend", "Desain REST API", "Manajemen Database"],
    tech: [react, ts, node],
};

export const mockFooter = {
    description: "sedikit rasa ingin tahu membawa jauh",
    copyright: "© 2026 [Nama Full]",
    extraText: "",
    socials: [
        { id: "linkedin", platform: "linkedin", label: "@namaakun", url: "https://linkedin.com/in/namaakun" },
        { id: "cv", platform: "cv", label: "Buka / unduh CV", url: "/cv.pdf" },
        { id: "instagram", platform: "instagram", label: "@namaakun", url: "https://instagram.com/namaakun" },
    ],
};
