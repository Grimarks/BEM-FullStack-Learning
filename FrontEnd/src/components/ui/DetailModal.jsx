import { useEffect, useRef } from "react";
import { X, ArrowUpRight, Sparkle } from "lucide-react";
import Eyebrow from "./Eyebrow.jsx";
import Chip from "./Chip.jsx";
import Button from "./Button.jsx";

export default function DetailModal({
                                        open,
                                        onClose,
                                        eyebrow,
                                        title,
                                        image,
                                        imageAlt,
                                        tagLeft,
                                        tagRight,
                                        previewLabel,
                                        aboutTitle,
                                        description,
                                        footerNote,
                                        children,
                                    }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    function handleBackdropClick(event) {
        if (event.target === dialogRef.current) onClose();
    }

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            onClick={handleBackdropClick}
            aria-labelledby="detail-title"
            className="m-auto max-h-[calc(100dvh-2rem)] w-[min(72.5rem,calc(100%-2rem))] max-w-none overflow-y-auto rounded-panel bg-transparent p-0 backdrop:bg-night/70 backdrop:backdrop-blur-sm"
        >
            {open && (
                <div className="rounded-panel border border-violet/30 bg-linear-to-b from-[#f6f5ff] to-[#f2f1fb] text-ink shadow-float">
                    {/* ---- Header ---- */}
                    <div className="flex items-start justify-between gap-6 px-6 pt-8 md:px-10 md:pt-10">
                        <div>
                            <Eyebrow dot="bg-pink" className="text-violet">
                                {eyebrow}
                            </Eyebrow>
                            <h2 id="detail-title" className="mt-3 font-display text-[clamp(2.25rem,1.6rem+2.4vw,3.5rem)] leading-none tracking-display text-night">
                                {title}
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Tutup detail"
                            className="grid size-12 shrink-0 place-items-center rounded-full border border-line bg-white text-ink transition hover:rotate-90 hover:border-ink"
                        >
                            <X className="size-5" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-10 px-6 py-8 md:px-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-14">
                        <figure>
                            <div className="relative overflow-hidden rounded-card border-[3px] border-edge">
                                <img src={image} alt={imageAlt} className="aspect-[582/380] w-full object-cover" />
                                <span className="absolute inset-x-4 top-4 flex justify-between gap-3">
                  <Chip>{tagLeft}</Chip>
                  <Chip>{tagRight}</Chip>
                </span>
                            </div>
                            <figcaption className="mt-4 flex items-center justify-between font-mono text-label uppercase tracking-label text-stone">
                                {previewLabel}
                                <Sparkle className="size-5 fill-violet text-violet" aria-hidden="true" />
                            </figcaption>
                        </figure>

                        <div>
                            <h3 className="font-display text-title tracking-display text-night">{aboutTitle}</h3>
                            <p className="mt-3 text-lg leading-relaxed text-muted">{description}</p>
                            <dl className="mt-8 space-y-5">{children}</dl>
                        </div>
                    </div>
                    {/*Footfooter*/}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-6 py-5 md:px-10">
                        <p className="font-mono text-label uppercase tracking-label text-stone">{footerNote}</p>
                        <Button variant="dark" onClick={onClose}>
                            Tutup detail <ArrowUpRight className="size-4" aria-hidden="true" />
                        </Button>
                    </div>
                </div>
            )}
        </dialog>
    );
}

export function DetailField({ label, children, divider = false }) {
    return (
        <div className={divider ? "border-b border-line pb-4" : undefined}>
            <dt className="font-mono text-label uppercase tracking-label text-stone">{label}</dt>
            <dd className="mt-2 text-lg text-ink">{children}</dd>
        </div>
    );
}