import { ArrowUp, ArrowUpRight } from "lucide-react";
import { profile } from "../../data/profile.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import Container from "../ui/Container.jsx";
import Button from "../ui/Button.jsx";
import Decor from "../ui/Decor.jsx";
import { ContactIcon } from "../ui/Icons.jsx";

export default function Contact() {
    return (

        <footer
            id="kontak"
            aria-labelledby="kontak-title"
            className="relative overflow-hidden rounded-t-[2.5rem] bg-night pt-28 pb-12 text-cream [--grid-line:rgb(255_255_255/0.04)] [--dot:rgb(198_255_52/0.25)] bg-grid lg:slide"
        >
            <div className="absolute bottom-0 left-0 h-[480px] w-[480px] rounded-full bg-violet/25 blur-3xl" aria-hidden="true" />
            <div className="absolute top-0 right-0 h-[420px] w-[420px] rounded-full bg-pink/15 blur-3xl" aria-hidden="true" />
            <div className="absolute top-16 left-0 hidden h-[560px] w-[220px] bg-dots fade-edges md:block" aria-hidden="true" />
            <div className="absolute top-40 right-0 hidden h-[560px] w-[220px] bg-dots fade-edges md:block" aria-hidden="true" />
            <Decor src="/images/cursor-white.png" className="top-28 left-[8%] w-20 -rotate-12 opacity-15" />
            <Decor src="/images/code-white.png" className="top-40 right-[8%] w-20 opacity-15" />

            <Container className="relative">
                <div className="relative mx-auto max-w-3xl text-center">
                    <Decor src="/images/star-lime.png" className="-top-6 left-[12%] w-16 -rotate-12" />
                    <SectionHeading
                        id="kontak-title"
                        eyebrow="Ayo terhubung"
                        dot="bg-coral"
                        tone="dark"
                        align="center"
                        line1="Ada sesuatu"
                        line2="yang ingin kamu diskusikan?"
                    />
                    <p className="mt-5 text-cream/90">
                        Baik itu proyek baru, kolaborasi teknis, atau tinjauan portofolio, saya senang mendengar dari kamu.
                    </p>

                    <ul className="mt-8 flex justify-center gap-2 lg:mt-3">
                        {profile.socials.map((social) => (
                            <li key={social.type}>
                                <a
                                    href={social.href}
                                    aria-label={social.label}
                                    title={social.label}
                                    className="grid size-11 place-items-center rounded-full text-cream transition hover:bg-white/10"
                                >
                                    <ContactIcon type={social.type} className="size-5" />
                                </a>
                            </li>
                        ))}
                    </ul>

                    <Button href={profile.whatsapp} target="_blank" rel="noreferrer" className="mt-6 lg:mt-3">
                        Kontak saya di Whatsapp <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Button>

                    <p className="mt-16 font-serif text-xl text-[#a99fb0] italic lg:mt-slide">{profile.closingLine}</p>
                </div>

                <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-white/10 pt-8 lg:mt-slide lg:pt-4">
                    <div>
                        <p className="font-display text-2xl tracking-display">
                            {profile.firstName} <span className="text-violet">{profile.lastName}</span>
                        </p>
                        <p className="mt-1 font-mono text-[11px] tracking-wide text-cream/50">
                            {profile.role} · {profile.location}
                        </p>
                    </div>
                    <a href="#top" className="inline-flex items-center gap-1.5 text-sm hover:text-violet">
                        Kembali ke atas <ArrowUp className="size-4" aria-hidden="true" />
                    </a>
                </div>
            </Container>
        </footer>
    );
}
