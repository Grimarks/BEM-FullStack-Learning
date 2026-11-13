export const JOURNEY_KINDS = [
    { value: "pekerjaan", label: "Pekerjaan" },
    { value: "magang", label: "Magang" },
    { value: "pendidikan", label: "Pendidikan" },
    { value: "pelatihan", label: "Pelatihan" },
];

export const PROJECT_CATEGORIES = [
    "Website",
    "Mobile",
    "UI/UX",
    "Machine Learning",
    "Artificial Intelligence",
    "Web3",
    "Game Development",
];

export const PROJECT_STATUSES = [
    { value: "konsep", label: "Konsep" },
    { value: "on-going", label: "Berjalan" },
    { value: "finished", label: "Selesai" },
];

export const LINK_PATTERN = String.raw`https?:\/\/\S+|#\S+|\/[^\/\s]\S*|mailto:\S+@\S+`;
export const LINK_HINT = "Boleh https://..., #bagian (mis. #proyek), /file (mis. /cv.pdf), atau mailto:email.";
export const isLink = (value) => !value || new RegExp(`^(?:${LINK_PATTERN})$`).test(value);

const labelOf = (list, value) => list.find((x) => x.value === value)?.label ?? value;
export const journeyKindLabel = (value) => labelOf(JOURNEY_KINDS, value);
export const projectStatusLabel = (value) => labelOf(PROJECT_STATUSES, value);
export const toDay = (value) => (value ? String(value).slice(0, 10) : "");
export const toMonth = (value) => (value ? String(value).slice(0, 7) : "");
export const monthToDay = (month) => (month ? `${month}-01` : "");

export const technologyFromApi = (t) => ({
    id: t.id_teknologi,
    name: t.nama_teknologi,
    iconId: t.id_ikon ?? null,
    iconUrl: t.ikon?.url_ikon ?? null,
});

export const techLinkFromApi = (link) => ({
    ...technologyFromApi(link.teknologi ?? { id_teknologi: link.id_teknologi, nama_teknologi: "?" }),
    role: link.kategori ?? "",
});

export const iconFromApi = (i) => ({ id: i.id_ikon, name: i.nama_ikon, url: i.url_ikon, category: i.kategori_ikon });

export const heroFromApi = (c) => ({
    displayName: c.nama_tampilan ?? "",
    roleLabel: c.label_profesi ?? "",
    headline: c.judul_utama ?? "",
    heroText: c.teks_utama_hero ?? "",
    supportText: c.teks_pendukung ?? "",
    extraText: c.teks_hero_lainnya ?? "",
    description: c.deskripsi ?? "",
    ctaLabel: c.teks_tombol_cta ?? "",
    ctaUrl: c.url_tujuan_cta ?? "",
});

export const heroToApi = (h) => ({
    nama_tampilan: h.displayName,
    label_profesi: h.roleLabel,
    judul_utama: h.headline,
    teks_utama_hero: h.heroText,
    teks_pendukung: h.supportText,
    teks_hero_lainnya: h.extraText,
    deskripsi: h.description,
    teks_tombol_cta: h.ctaLabel,
    url_tujuan_cta: h.ctaUrl,
});

export const footerTextFromApi = (c) => ({
    description: c.deskripsi_footer ?? "",
    copyright: c.teks_hak_cipta ?? "",
    extraText: c.teks_tambahan_footer ?? "",
});

export const footerTextToApi = (f) => ({
    deskripsi_footer: f.description,
    teks_hak_cipta: f.copyright,
    teks_tambahan_footer: f.extraText,
});

export const profileFromApi = (p) => ({
    photoUrl: p.url_foto_profil ?? "",
    fullName: p.nama_lengkap ?? "",
    role: p.jabatan_profesional ?? "",
    location: p.lokasi ?? "",
    email: p.email ?? "",
    bio: p.biografi ?? "",
    about: p.deskripsi_tentang_saya ?? "",
});

export const profileToApi = (p) => ({
    url_foto_profil: p.photoUrl,
    nama_lengkap: p.fullName,
    jabatan_profesional: p.role,
    lokasi: p.location,
    email: p.email,
    biografi: p.bio,
    deskripsi_tentang_saya: p.about,
});

export const journeyFromApi = (j) => ({
    id: j.id_perjalanan,
    title: j.informasi_tambahan ?? "",
    org: j.institusi ?? "",
    kind: j.kategori ?? "",
    startDate: toMonth(j.tanggal_mulai),
    endDate: j.tanggal_selesai ? toMonth(j.tanggal_selesai) : null, // null = masih berjalan
    description: j.deskripsi ?? "",
    sortOrder: j.sort_order ?? 0,
});

export const journeyToApi = (j) => ({
    informasi_tambahan: j.title,
    institusi: j.org,
    kategori: j.kind,
    tanggal_mulai: monthToDay(j.startDate),
    tanggal_selesai: j.endDate ? monthToDay(j.endDate) : "", // "" = masih berjalan
    deskripsi: j.description,
    sort_order: j.sortOrder ?? 0,
});

export const projectFromApi = (p, techLinks = []) => ({
    id: p.id_proyek,
    title: p.judul_proyek ?? "",
    category: p.kategori ?? "",
    status: p.status ?? "",
    imageUrl: p.url_sampul_proyek ?? "",
    summary: p.deskripsi ?? "",
    date: toMonth(p.tanggal),
    demoUrl: p.url_demo ?? "",
    githubUrl: p.url_github ?? "",
    priority: p.prioritas ?? 100,
    tech: techLinks.map(techLinkFromApi),
});

export const projectToApi = (p) => ({
    judul_proyek: p.title,
    kategori: p.category,
    status: p.status,
    url_sampul_proyek: p.imageUrl,
    deskripsi: p.summary,
    tanggal: monthToDay(p.date),
    url_demo: p.demoUrl,
    url_github: p.githubUrl,
    prioritas: p.priority ?? 100,
});

export const certificateFromApi = (c) => ({
    id: c.id_sertifikasi,
    title: c.nama_sertifikat ?? "",
    issuer: c.penerbit ?? "",
    issuedAt: toDay(c.tanggal_terbit),
    expiresAt: c.tanggal_kadaluarsa ? toDay(c.tanggal_kadaluarsa) : null,
    credentialId: c.nomor_sertifikat ?? "",
    credentialUrl: c.url_sertifikat ?? "",
    description: c.deskripsi ?? "",
    sortOrder: c.sort_order ?? 0,
});

export const certificateToApi = (c) => ({
    nama_sertifikat: c.title,
    penerbit: c.issuer,
    tanggal_terbit: c.issuedAt ?? "",
    tanggal_kadaluarsa: c.expiresAt ?? "",
    nomor_sertifikat: c.credentialId,
    url_sertifikat: c.credentialUrl,
    deskripsi: c.description,
    sort_order: c.sortOrder ?? 0,
});

export const socialFromApi = (s) => ({
    id: s.id_media_sosial,
    platform: s.nama_platform ?? "",
    label: s.nama_akun ?? "",
    url: s.url_tujuan ?? "",
    iconId: s.id_ikon ?? null,
    iconUrl: s.ikon?.url_ikon ?? null,
    sortOrder: s.sort_order ?? 0,
});

export const socialToApi = (s) => ({
    nama_platform: s.platform,
    nama_akun: s.label,
    url_tujuan: s.url,
    id_ikon: s.iconId ?? null,
    sort_order: s.sortOrder ?? 0,
});

export const journeyToPublic = (j) => ({
    id: String(j.id),
    kind: journeyKindLabel(j.kind),
    title: j.title || j.org,
    org: j.org,
    description: j.description,
});

const PLACEHOLDER_IMAGES = ["/images/project-1.webp", "/images/project-2.webp", "/images/project-3.webp"];

export const projectToPublic = (p, index = 0) => ({
    id: String(p.id),
    title: p.title,
    category: p.category,
    categoryLong: p.category,
    status: projectStatusLabel(p.status),
    imageUrl: p.imageUrl || PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
    summary: p.summary,
    githubUrl: p.githubUrl,
    demoUrl: p.demoUrl,
    tech: p.tech,
});

const formatMonthYear = (day) =>
    day ? new Date(`${day}T00:00:00`).toLocaleDateString("id-ID", { month: "long", year: "numeric" }) : "";

export const certificateToPublic = (c) => ({
    id: String(c.id),
    title: c.title,
    issuer: c.issuer,
    date: formatMonthYear(c.issuedAt),
    image: "/images/certificate-placeholder.svg",
    description: c.description,
    credentialId: c.credentialId,
    credentialUrl: c.credentialUrl,
});
