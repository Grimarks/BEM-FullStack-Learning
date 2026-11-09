
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cx } from "../../lib/cx.js";

export default function CarouselControls({ onPrev, onNext, canPrev, canNext, label, className }) {
    const base =
        "grid size-11 place-items-center rounded-full transition duration-200 disabled:cursor-not-allowed disabled:opacity-35";
    return (
        <div className={cx("flex gap-3", className)}>
            <button
                type="button"
                onClick={onPrev}
                disabled={!canPrev}
                aria-label={`${label} sebelumnya`}
                className={cx(base, "bg-sand text-ink enabled:hover:bg-[#d9d3c4]")}
            >
                <ArrowLeft className="size-4" aria-hidden="true" />
            </button>
            <button
                type="button"
                onClick={onNext}
                disabled={!canNext}
                aria-label={`${label} berikutnya`}
                className={cx(base, "bg-ink text-cream enabled:hover:bg-black")}
            >
                <ArrowRight className="size-4" aria-hidden="true" />
            </button>
        </div>
    );
}
