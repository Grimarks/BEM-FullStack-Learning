import { useState } from "react";
import { certificates } from "../../data/profile.js";
import { useCarousel } from "../../hooks/useCarousel.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import Container from "../ui/Container.jsx";
import CarouselControls from "../ui/CarouselControls.jsx";
import MediaCard from "../ui/MediaCard.jsx";
import DetailModal, { DetailField } from "../ui/DetailModal.jsx";
import Chip from "../ui/Chip.jsx";
import Decor from "../ui/Decor.jsx";

export default function Certificates() {

    const carousel = useCarousel();
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
                    <CarouselControls
                        label="Sertifikat"
                        onPrev={carousel.prev}
                        onNext={carousel.next}
                        canPrev={carousel.canPrev}
                        canNext={carousel.canNext}
                    />
                </div>

                <ul
                    ref={carousel.trackRef}
                    className="no-scrollbar -mx-2 mt-12 flex snap-x snap-mandatory scroll-px-2 gap-6 overflow-x-auto px-2 pt-2 pb-6 lg:mt-slide"
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
                                {cert.issuer} · {cert.date}
                            </p>
                        </li>
                    ))}
                </ul>
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
                footerNote={`Sertifikasi / ${selected?.issuer} · ${selected?.date}`}
            >
                <DetailField label="Penerbit" divider>
                    {selected?.issuer}
                </DetailField>
                <DetailField label="Tanggal penyelesaian" divider>
                    {selected?.date}
                </DetailField>
                <div>
                    <Chip tone="lime">Sertifikasi</Chip>
                </div>
            </DetailModal>
        </section>
    );
}
