import { api } from "../../lib/api.js";
import { useFetch } from "../../hooks/useFetch.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import Container from "../ui/Container.jsx";
import Decor from "../ui/Decor.jsx";
import { Skeleton, ErrorState, EmptyState } from "../ui/FetchStates.jsx";

export default function Journey() {
    const { status, data: journey, error, reload } = useFetch(api.getJourney);

    return (
        <section id="riwayat" aria-labelledby="riwayat-title" className="relative overflow-hidden bg-paper bg-grid pt-24 pb-24 md:pb-36 lg:slide">
            <Decor src="/images/pixels-lime.png" className="top-20 right-[6%] w-16" />
            <div className="absolute top-40 right-0 h-[420px] w-[200px] bg-dots fade-edges" aria-hidden="true" />

            <Container className="relative">
                <SectionHeading
                    id="riwayat-title"
                    eyebrow="Pengalaman & pendidikan"
                    dot="bg-sun"
                    line1="Perjalanan"
                    line2="yang membentuk saya."
                />

                <div className="mt-12 lg:mt-slide">
                    {status === "loading" && (
                        <div className="space-y-3.5 lg:grid lg:grid-cols-2 lg:gap-3.5 lg:space-y-0">
                            <p className="sr-only" role="status">Memuat riwayat…</p>
                            <Skeleton className="h-36 lg:h-45" />
                            <Skeleton className="h-36 lg:h-45" />
                            <Skeleton className="h-36 lg:h-45" />
                            <Skeleton className="h-36 lg:h-45" />
                        </div>
                    )}

                    {status === "error" && <ErrorState error={error} onRetry={reload} />}

                    {status === "success" && journey.length === 0 && <EmptyState>Belum ada riwayat yang ditambahkan.</EmptyState>}

                    {status === "success" && journey.length > 0 && (
                        <ol className="space-y-3.5 lg:grid lg:grid-cols-2 lg:gap-3.5 lg:space-y-0">
                            {journey.map((item) => (
                                <li key={item.id} className="rounded-card border border-white bg-[#f9f9fb] px-6 py-6 shadow-card md:px-8 lg:py-4">
                                    <p className="font-mono text-label uppercase tracking-label text-violet-deep">{item.kind}</p>
                                    <h3 className="mt-2 font-display text-title tracking-display text-night">{item.title}</h3>
                                    <p className="mt-2 text-muted">{item.org}</p>
                                    {item.description && <p className="mt-2 leading-relaxed text-muted">{item.description}</p>}
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </Container>
        </section>
    );
}
