import { Check, Sparkle } from "lucide-react";
import { profile } from "../../data/profile.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import Container from "../ui/Container.jsx";
import Decor from "../ui/Decor.jsx";
import { ContactIcon, TechLogo, techName } from "../ui/Icons.jsx";

function Label({children}){
    return <h3 className="font-mono text-label uppercase tracking-label text-stone">{children}</h3>
}

export default function About(){
    return(
        <section id="profil" aria-labelledby="profil-title" className="relative overflow-hidden bg-paper bg-grid py-24 md:py-36 lg:slide">

            <div className="absolute top-20 left-0 hidden h-[420px] w-[220px] bg-dots fade-edges md:block" aria-hidden="true" />
            <div className="absolute top-0 right-0 h-[520px] w-[520px] rounded-full bg-pink/10 blur-3xl" aria-hidden="true" />

            <Container className="relative">
                <div className="grid items-end gap-10 lg:grid-cols-[1fr_400px] lg:gap-6 xl:grid-cols-[1fr_480px]">
                    <SectionHeading
                        id="profil-title"
                        eyebrow="Profil pengembang fullstack"
                        dot="bg-sage"
                        line1="Hii, get to know me!"
                        line2="siapakah saya?"
                    />
                    <div className="rounded-3xl border border-white bg-white/60 p-6 shadow-card backdrop-blur lg:p-5">
                        <p className="leading-loose text-ink lg:leading-relaxed">{profile.pitch}</p>
                        <p className="mt-4 font-serif text-xl text-violet-deep italic lg:mt-2">↳ {profile.motto}</p>
                    </div>
                </div>
                <div className="mt-20 grid gap-12 md:grid-cols-[300px_1fr] lg:mt-slide lg:grid-cols-[240px_1fr_220px] lg:gap-10 xl:grid-cols-[280px_1fr_280px]">
                    <figure className="relative mx-auto w-full max-w-[340px] -rotate-2 self-start rounded-[22px] bg-cream p-3 shadow-float">
                        <Decor src="/images/mask.png" className="-top-6 -right-6 w-20 rotate-6" />
                        <img
                            src={profile.photo}
                            alt={`Foto ${profile.fullName}`}
                            className="aspect-[1135/1340] w-full rounded-[14px] object-cover lg:aspect-auto lg:h-[clamp(11rem,calc(100svh-24rem),21rem)]"
                        />
                        <figcaption className="flex items-end justify-between px-3 pt-5 pb-3 lg:pt-3 lg:pb-1">
                            <div>
                                <p className="font-serif text-xl italic">{profile.fullName}</p>
                                <p className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-label text-violet">
                                    <span className="size-1.5 rounded-full bg-pink" aria-hidden="true" />
                                    {profile.location}
                                </p>
                            </div>
                            <Sparkle className="size-6 fill-violet text-violet" aria-hidden="true" />
                        </figcaption>
                    </figure>

                    {/* Kolom tengah */}
                    <div>
                        <Label>Tentang</Label>
                        <p className="mt-4 max-w-[46ch] text-lg leading-[1.7] lg:mt-3 lg:text-base lg:leading-relaxed">{profile.about}</p>

                        <ul className="mt-7 space-y-3 lg:mt-4 lg:space-y-2">
                            {profile.highlights.map((item) => (
                                <li key={item} className="flex items-center gap-3 text-[15px]">
                                    <Check className="size-4 shrink-0 text-sage" aria-hidden="true" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-10 lg:mt-5">
                            <Label>Kontak</Label>
                            <ul className="mt-4 space-y-3 lg:mt-3 lg:grid lg:grid-cols-2 lg:gap-x-4 lg:gap-y-2 lg:space-y-0">
                                {profile.contacts.map((contact) => {
                                    const content = (
                                        <>
                                            <ContactIcon type={contact.type} className="size-5 shrink-0 text-muted" />
                                            {contact.label}
                                        </>
                                    );
                                    return (
                                        <li key={contact.type}>
                                            {contact.href ? (
                                                <a href={contact.href} className="flex items-center gap-3 hover:text-violet">
                                                    {content}
                                                </a>
                                            ) : (
                                                <span className="flex items-center gap-3">{content}</span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className="md:col-span-2 lg:col-span-1">
                        <Label>Teknologi</Label>
                        <ul className="mt-5 flex flex-wrap gap-6 lg:mt-3 lg:gap-5">
                            {profile.tech.map((id) => (
                                <li key={id} title={techName(id)} className="drop-shadow-[0_6px_10px_rgb(74_31_168/0.15)]">
                                    <TechLogo id={id} className="size-8" />
                                    <span className="sr-only">{techName(id)}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-10 lg:mt-5">
                            <Label>Keahlian</Label>
                            <ul className="mt-4 space-y-3 pl-3 text-[15px] lg:mt-3 lg:space-y-2">
                                {profile.skills.map((skill) => (
                                    <li key={skill}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}