import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { profile } from "../../data/profile.js";
import { api } from "../../lib/api.js";
import { useFetch } from "../../hooks/useFetch.js";
import { useCarousel } from "../../hooks/useCarousel.js";
import { Skeleton, ErrorState, EmptyState } from "../ui/FetchStates.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";
import Container from "../ui/Container.jsx";
import CarouselControls from "../ui/CarouselControls.jsx"
import MediaCard from "../ui/MediaCard.jsx";
import DetailModal, { DetailField } from "../ui/DetailModal.jsx";
import Chip from "../ui/Chip.jsx";
import Decor from "../ui/Decor.jsx";
import { ContactIcon } from "../ui/Icons.jsx";

const pad = (n) => String(n).padStart(2, "0");
export default function Projects() {
    const { status, data, error, reload } = useFetch(api.getProjects);
    const projects = data ?? []; // selama data belum datang, anggap list kosong
    const hasProjects = status === "success" && projects.length > 0;
    const carousel = useCarousel(projects.length);
    const [selected, setSelected] = useState(null);
    const index = projects.findIndex((p) => p.id === selected?.id) + 1;

    return (
        <section id="proyek" aria-labelledby="proyek-title" className="relative overflow-hidden bg-paper bg-grid py-24 md:py-32 lg:slide">
            <div className="absolute top-0 right-0 h-[480px] w-[480px] rounded-full bg-pink/10 blur-3xl" aria-hidden="true" />
            <Decor src="/images/code-lime.png" className="top-[60%] left-[1.5%] w-12 opacity-40" />
            <Decor src="/images/cursor-violet.png" className="right-[2%] bottom-[30%] w-12 opacity-70" />

            <Container className="relative">
                <div className="flex flex-wrap items-end justify-between gap-8">
                    <SectionHeading
                        id="proyek-title"
                        eyebrow="Proyek pilihan"
                        dot="bg-coral"
                        line1="Proyek proyek"
                        line2="yang pernah saya buat."
                    />
                    <div className="max-w-[300px]">
                        <p className="text-sm leading-relaxed text-stone">
                            Eksplorasi produk, demo teknis, dan pencapaian belajar yang relevan untuk profil pengembang fullstack.
                        </p>
                        {hasProjects && (
                            <CarouselControls
                                label="Proyek"
                                className="mt-5"
                                onPrev={carousel.prev}
                                onNext={carousel.next}
                                canPrev={carousel.canPrev}
                                canNext={carousel.canNext}
                            />
                        )}
                    </div>
                </div>

                <div className="mt-12 lg:mt-slide">
                    {status === "loading" && (
                        <div className="-mx-2 flex gap-6 overflow-hidden px-2 pt-2 pb-6">
                            <p className="sr-only" role="status">Memuat proyek…</p>
                            <Skeleton className="carousel-card aspect-[582/380] shrink-0" />
                            <Skeleton className="carousel-card aspect-[582/380] shrink-0" />
                        </div>
                    )}

                    {status === "error" && <ErrorState error={error} onRetry={reload} />}

                    {status === "success" && projects.length === 0 && <EmptyState>Belum ada proyek yang dipublikasikan.</EmptyState>}

                    {hasProjects && (
                        <ul
                            ref={carousel.trackRef}
                            className="no-scrollbar -mx-2 flex snap-x snap-mandatory scroll-px-2 gap-6 overflow-x-auto px-2 pt-2 pb-6"
                        >
                            {projects.map((project, i) => (
                                <li key={project.id} className="carousel-card shrink-0 snap-start">
                                    <MediaCard
                                        image={project.imageUrl}
                                        alt={`Pratinjau ${project.title}`}
                                        tagLeft={`${pad(i + 1)} / ${project.title}`}
                                        tagRight={project.category}
                                        onOpen={() => setSelected(project)}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mt-10 border-t border-line pt-8 lg:mt-1 lg:pt-3">
                    <a href={profile.githubProfile} className="inline-flex items-center gap-1.5 text-[15px] hover:text-violet">
                        Lihat semua karya <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                </div>
            </Container>

            <DetailModal
                open={selected !== null}
                onClose={() => setSelected(null)}
                eyebrow={`Detail proyek / ${pad(index)}`}
                title={selected?.title}
                image={selected?.imageUrl}
                imageAlt={`Pratinjau ${selected?.title}`}
                tagLeft={`${pad(index)} / Proyek`}
                tagRight={selected?.status}
                previewLabel="Pratinjau ruang kerja"
                aboutTitle="Tentang proyek"
                description={selected?.summary}
                footerNote="Proyek pilihan"
            >
                <DetailField label="Kategori" divider>
                    <span className="uppercase">{selected?.categoryLong}</span>
                </DetailField>
                <DetailField label="Status">
                    <Chip tone="lime">{selected?.status}</Chip>
                </DetailField>
                <DetailField label="GitHub">
                    <a href={selected?.githubUrl} className="inline-flex items-center gap-2 break-all text-violet hover:underline">
                        <ContactIcon type="github" className="size-5 text-ink" />
                        {/* Tampilkan URL tanpa "https://" supaya lebih ringkas */}
                        {selected?.githubUrl?.replace("https://", "")}
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                </DetailField>
            </DetailModal>
        </section>
    );
}
