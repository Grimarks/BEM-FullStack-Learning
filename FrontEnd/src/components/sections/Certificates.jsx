import { useState } from "react";
import { api } from "../../lib/api.js";
import { useFetch } from "../../hooks/useFetch.js";
import { useCarousel } from "../../hooks/useCarousel.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import Container from "../ui/Container.jsx";
import CarouselControls from "../ui/CarouselControls.jsx";
import MediaCard from "../ui/MediaCard.jsx";
import DetailModal, { DetailField } from "../ui/DetailModal.jsx";
import Chip from "../ui/Chip.jsx";
import Decor from "../ui/Decor.jsx";
import { Skeleton, ErrorState, EmptyState } from "../ui/FetchStates.jsx";

export default function Certificates() {
    const { status, data, error, reload } = useFetch(api.getCertificates);
    const certificates = data ?? [];
    const hasCertificates = status === "success" && certificates.length > 0;
    const carousel = useCarousel(certificates.length);
    const [selected, setSelected] = useState(null);

    return (
        <section id="sertifikasi" aria-labelledby="sertifikasi-title" className="relative overflow-hidden bg-lilac bg-grid py-24 md:py-32 lg:slide">
            <Decor src="/images/mask.png" className="top-20 right-[6%] w-20 -rotate-12" />
            <div className="absolute top-16 left-0 hidden h-[560px] w-[200px] bg-dots fade-edges md:block" aria-hidden="true" />
            <div className="absolute right-0 bottom-0 hidden h-[460px] w-[220px] bg-dots fade-edges md:block" aria-hidden="true" />
            <Decor src="/images/star-lime.png" className="right-[2%] bottom-16 w-12 opacity-70" />

            <Container className="relative">
                <div className="flex flex-wrap items-end justify-between gap-8">
                    <SectionHeading
                        id="sertifikasi-title"
                        eyebrow="Sertifikasi"
                        dot="bg-steel"
                        line1="Sertifikasi dan penghargaan"
                        line2="yang dimiliki oleh saya."
                    />
                    {hasCertificates && (
                        <CarouselControls
                            label="Sertifikat"
                            onPrev={carousel.prev}
                            onNext={carousel.next}
                            canPrev={carousel.canPrev}
                            canNext={carousel.canNext}
                        />
                    )}
                </div>

                <div className="mt-12 lg:mt-slide">
                    {status === "loading" && (
                        <div className="-mx-2 flex gap-6 overflow-hidden px-2 pt-2 pb-6">
                            <p className="sr-only" role="status">Memuat sertifikasi…</p>
                            <Skeleton className="carousel-card aspect-[582/380] shrink-0" />
                            <Skeleton className="carousel-card aspect-[582/380] shrink-0" />
                        </div>
                    )}

                    {status === "error" && <ErrorState error={error} onRetry={reload} />}

                    {status === "success" && certificates.length === 0 && (
                        <EmptyState>Belum ada sertifikasi yang ditambahkan.</EmptyState>
                    )}

                    {hasCertificates && (
                        <ul
                            ref={carousel.trackRef}
                            className="no-scrollbar -mx-2 flex snap-x snap-mandatory scroll-px-2 gap-6 overflow-x-auto px-2 pt-2 pb-6"
                        >
                            {certificates.map((cert) => (
                                <li key={cert.id} className="carousel-card shrink-0 snap-start">
                                    <MediaCard
                                        image={cert.image}
                                        alt={`Sertifikat ${cert.title}`}
                                        tagLeft="Sertifikasi"
                                        tagRight={cert.issuer}
                                        onOpen={() => setSelected(cert)}
                                    />
                                    <p className="mt-3 font-mono text-[10px] uppercase tracking-label text-stone">
                                        {[cert.title, cert.date].filter(Boolean).join(" · ")}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Container>

            <DetailModal
                open={selected !== null}
                onClose={() => setSelected(null)}
                eyebrow="Detail sertifikasi"
                title={selected?.title}
                image={selected?.image}
                imageAlt={`Sertifikat ${selected?.title}`}
                tagLeft="Sertifikasi"
                tagRight={selected?.issuer}
                previewLabel="Pratinjau sertifikasi"
                aboutTitle="Tentang kredensial"
                description={selected?.description}
                footerNote={["Sertifikasi", selected?.issuer, selected?.date].filter(Boolean).join(" · ")}
            >
                <DetailField label="Penerbit" divider>
                    {selected?.issuer}
                </DetailField>
                {selected?.date && (
                    <DetailField label="Tanggal terbit" divider>
                        {selected.date}
                    </DetailField>
                )}
                {selected?.credentialId && (
                    <DetailField label="ID kredensial" divider>
                        {selected.credentialId}
                    </DetailField>
                )}
                {selected?.credentialUrl && (
                    <DetailField label="Tautan kredensial" divider>
                        <a href={selected.credentialUrl} target="_blank" rel="noreferrer" className="text-violet hover:underline">
                            Lihat kredensial
                        </a>
                    </DetailField>
                )}
                <div>
                    <Chip tone="lime">Sertifikasi</Chip>
                </div>
            </DetailModal>
        </section>
    );
}
