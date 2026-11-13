import {ArrowDown} from "lucide-react";
import {profile} from "../../data/profile.js";
import { api } from "../../lib/api.js";
import { useFetch } from "../../hooks/useFetch.js";
import Button from "../ui/Button.jsx";
import Eyebrow from "../ui/Eyebrow.jsx";
import Decor from "../ui/Decor.jsx";

export default function Hero (){
    const { data: hero } = useFetch(api.getHero);
    const name = hero?.displayName || profile.fullName;
    const role = hero?.roleLabel || profile.role;
    return (
        <section id="top" className="relative isolate flex min-h-svh flex-col overflow-hidden bg-night text-cream">
            <img
                src="/images/hero-city-2400.webp"
                srcSet="/images/hero-city-1280.webp 1280w, /images/hero-city-2400.webp 2400w"
                sizes="100vw"
                alt=""
                fetchPriority="high"
                className="absolute inset-0 -z-20 size-full object-cover object-[center_70%]"
            />
            <div className="absolute inset-0 -z-10 bg-linear-to-b from-[#1d0b3b] via-[#1d0b3b]/80 to-[#1d0b3b]/10" />

            <Decor src="/images/mascot.png" className="top-24 right-[7%] w-24 -rotate-6 lg:w-28" />
            <Decor src="/images/cursor-white.png" className="top-[20%] right-[18%] w-24 opacity-50" />
            <Decor src="/images/star-lime.png" className="right-[12%] bottom-[18%] w-16 rotate-12" />

            <p className="absolute top-7 left-6 hidden text-sm text-cream/90 lg:block md:left-14">{name}</p>

            <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 pt-28 pb-32 text-center">
                <Eyebrow dot="bg-coral" className="text-cream">
                    {role}
                </Eyebrow>

                <h1 className="relative mt-5 font-display text-hero tracking-display">
                    <Decor src="/images/mask.png" className="-top-12 -left-16 w-28 -rotate-12 drop-shadow-[0_0_18px_rgb(255_77_141/0.6)]" />
                    {hero?.headline ? (
                        hero.headline
                    ) : (
                        <>
                            Membangun &amp;
                            <span className="block text-violet">Meluncurkan.</span>
                        </>
                    )}
                </h1>

                {hero?.heroText && (
                    <p className="mt-6 max-w-2xl text-lg text-cream/90">{hero.heroText}</p>
                )}
                {hero?.supportText && (
                    <p className="mt-3 max-w-2xl text-cream/80">{hero.supportText}</p>
                )}
                {hero?.extraText && (
                    <p className="mt-2 max-w-2xl text-sm text-cream/70">{hero.extraText}</p>
                )}
                {hero?.description && (
                    <p className="mt-4 max-w-xl text-sm text-cream/70">{hero.description}</p>
                )}

                <div className="mt-10 flex flex-wrap justify-center gap-3">
                    <Button href={hero?.ctaUrl || "#proyek"} variant="ghost">
                        {hero?.ctaLabel || "Jelajahi Proyek"}
                    </Button>
                    <Button href="#profil" variant="cream">Lihat Profil</Button>
                    <Button href={profile.cvUrl} variant="ghost" download>
                        <ArrowDown className="size-4" aria-hidden="true" /> Download CV
                    </Button>
                </div>
            </div>

            <div className="absolute inset-x-6 bottom-8 flex items-center justify-between md:inset-x-14">
                <p className="font-mono text-[10px] uppercase tracking-label text-cream/80">{profile.heroCorner}</p>
                <a href="#profil" className="group flex items-center gap-3 text-xs text-cream/90 hover:text-white">
                    Gulir ke bawah
                    <span className="grid size-9 place-items-center rounded-full border border-cream/40 transition group-hover:translate-y-1">
            <ArrowDown className="size-3.5" aria-hidden="true" />
          </span>
                </a>
            </div>

        </section>
    )

}