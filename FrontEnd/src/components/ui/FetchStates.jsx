import { RotateCw, WifiOff, Inbox } from "lucide-react";
import { cx } from "../../lib/cx.js";

export function Skeleton({ className }) {
    return <div className={cx("animate-pulse rounded-card bg-violet/10", className)} aria-hidden="true" />;
}

export function ErrorState({ error, onRetry, className }) {
    return (
        <div
            role="alert"
            className={cx("flex flex-col items-start gap-4 rounded-card border border-pink/30 bg-white/70 p-6 sm:flex-row sm:items-center", className)}
        >
            <WifiOff className="size-6 shrink-0 text-pink" aria-hidden="true" />
            <div className="flex-1">
                <p className="font-medium text-night">Data gagal dimuat.</p>
                <p className="mt-1 text-sm text-muted">{error?.message}</p>
            </div>
            <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-black"
            >
                <RotateCw className="size-4" aria-hidden="true" /> Coba lagi
            </button>
        </div>
    );
}

export function EmptyState({ children, className }) {
    return (
        <div className={cx("flex items-center gap-4 rounded-card border border-dashed border-line bg-white/50 p-6 text-muted", className)}>
            <Inbox className="size-6 shrink-0" aria-hidden="true" />
            <p>{children}</p>
        </div>
    );
}