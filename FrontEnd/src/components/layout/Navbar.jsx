import { useState } from "react";
import { Mail, Menu, X } from "lucide-react";
import {navItems} from "../../data/profile.js";
import { useActiveSection } from "../../hooks/useActiveSection.js";
import { cx } from "../../lib/cx.js";

const sectionIds = [...navItems.map((item) => item.id), "kontak"];

export default function Navbar(){
    const active = useActiveSection(sectionIds);
    const [menuOpen, setMenuOpen] = useState(false);

    return(
        <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-4">
            <nav
                aria-label="Navigasi utama"
                className="relative flex items-center gap-1 rounded-full border border-white/25 bg-plum/80 p-1.5 shadow-float backdrop-blur-md"
            >
                <a href="#top" aria-label="Kembali ke atas" className="mr-1 block size-10 overflow-hidden rounded-full bg-violet ring-2 ring-white/20">
                    <img src="/images/mascot.png" alt="" className="size-full scale-125 object-cover object-top" />
                </a>

                <ul className="hidden items-center md:flex">
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                // aria-current memberi tahu screen reader "kamu sedang di sini"
                                aria-current={active === item.id ? "true" : undefined}
                                className={cx(
                                    "block rounded-full px-4 py-2 text-[15px] transition-colors",
                                    active === item.id ? "bg-white/10 text-white" : "text-[#c7c5cf] hover:text-white",
                                )}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <a
                    href="#kontak"
                    className="ml-1 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[15px] font-medium text-ink transition hover:bg-cream"
                >
                    <Mail className="size-4" aria-hidden="true" />
                    Kontak
                </a>

                <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-menu"
                    aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
                    className="grid size-10 place-items-center rounded-full text-cream md:hidden"
                >
                    {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
                </button>

                {menuOpen && (
                    <ul
                        id="mobile-menu"
                        className="absolute inset-x-0 top-[calc(100%+0.5rem)] rounded-3xl border border-white/20 bg-plum/95 p-2 shadow-float backdrop-blur-md md:hidden"
                    >
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <a
                                    href={`#${item.id}`}
                                    // Setelah memilih menu, tutup lagi menunya
                                    onClick={() => setMenuOpen(false)}
                                    className="block rounded-2xl px-4 py-3 text-cream hover:bg-white/10"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </nav>
        </header>
    );
}
