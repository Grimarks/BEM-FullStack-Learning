import { useState } from "react";
import { LayoutGrid, Sun, User, Clock, Briefcase, Award, Link2, Menu, X, ExternalLink, LogOut } from "lucide-react";
import { cx } from "../../lib/cx.js";
import { handleLinkClick } from "../lib/router.js";
import { isMockMode } from "../lib/adminApi.js";

export const adminPages = [
    { path: "/admin", label: "Ringkasan", icon: LayoutGrid, key: null, description: null },
    { path: "/admin/hero", label: "Hero", icon: Sun, key: "hero", description: "Teks dan tombol ajakan" },
    { path: "/admin/profil", label: "Profil", icon: User, key: "profile", description: "Informasi diri dan teknologi" },
    { path: "/admin/perjalanan", label: "Perjalanan", icon: Clock, key: "journey", description: "Pendidikan dan pengalaman" },
    { path: "/admin/proyek", label: "Proyek", icon: Briefcase, key: "projects", description: "Proyek dan tautan portofolio" },
    { path: "/admin/sertifikasi", label: "Sertifikasi", icon: Award, key: "certificates", description: "Kredensial dan sertifikat" },
    { path: "/admin/footer", label: "Footer & Sosial", icon: Link2, key: "footer", description: "Teks footer dan tautan sosial" },
];

function Sidebar({ currentPath, onNavigate, username, onLogout }) {
    return (
        <nav aria-label="Menu admin" className="flex h-full flex-col">
            <div className="border-b border-zinc-200 px-6 py-6">
                <p className="text-xl font-semibold text-zinc-900">CMS Portofolio</p>
                <p className="mt-1 text-xs tracking-wide text-zinc-500 uppercase">Admin</p>
            </div>

            <ul className="flex flex-col gap-1 p-3">
                {adminPages.map(({ path, label, icon: Icon }) => {
                    const active = currentPath === path;
                    return (
                        <li key={path}>
                            <a
                                href={path}
                                aria-current={active ? "page" : undefined}
                                onClick={(event) => {
                                    handleLinkClick(event, path);
                                    onNavigate();
                                }}
                                className={cx(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] transition-colors",
                                    active ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-700 hover:bg-zinc-50",
                                )}
                            >
                                <Icon className="size-5 text-zinc-500" strokeWidth={1.75} aria-hidden="true" />
                                {label}
                            </a>
                        </li>
                    );
                })}
            </ul>

            <div className="mt-auto space-y-3 border-t border-zinc-200 p-6 text-sm">
                {isMockMode && (
                    <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                        Mode data contoh (VITE_USE_MOCK): perubahan disimpan di browser ini saja.
                    </p>
                )}
                {username && <p className="truncate text-zinc-500">Masuk sebagai <span className="font-semibold text-zinc-900">{username}</span></p>}
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <a href="/" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900">
                        Lihat situs <ExternalLink className="size-3.5" aria-hidden="true" />
                    </a>
                    {onLogout && !isMockMode && (
                        <button type="button" onClick={onLogout} className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900">
                            Keluar <LogOut className="size-3.5" aria-hidden="true" />
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default function AdminLayout({ currentPath, title, username, onLogout, children }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-svh bg-white font-[system-ui] text-zinc-900 lg:grid lg:grid-cols-[17rem_1fr]">
            <aside
                className={cx(
                    "fixed inset-y-0 left-0 z-30 w-72 border-r border-zinc-200 bg-white transition-transform lg:sticky lg:top-0 lg:h-svh lg:w-auto lg:translate-x-0",
                    menuOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <Sidebar currentPath={currentPath} onNavigate={() => setMenuOpen(false)} username={username} onLogout={onLogout} />
            </aside>
            {menuOpen && (
                <div className="fixed inset-0 z-20 bg-zinc-900/30 lg:hidden" onClick={() => setMenuOpen(false)} aria-hidden="true" />
            )}

            <div className="min-w-0">
                <header className="flex h-16 items-center gap-3 border-b border-zinc-200 px-4 md:h-[6.25rem] md:px-12">
                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-expanded={menuOpen}
                        aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
                        className="grid size-10 place-items-center rounded-lg border border-zinc-200 lg:hidden"
                    >
                        {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
                    </button>

                    <nav aria-label="Breadcrumb" className="text-[15px]">
                        <ol className="flex items-center gap-2">
                            <li className="text-zinc-500">Konten</li>
                            <li aria-current="page" className="text-zinc-900">
                                <span aria-hidden="true">/ </span>
                                {title}
                            </li>
                        </ol>
                    </nav>
                    <p className="ml-auto hidden text-zinc-500 sm:block">CMS Portofolio</p>
                </header>

                <main className="mx-auto max-w-[110rem] px-4 py-8 md:px-12 md:py-12">{children}</main>
            </div>
        </div>
    );
}
