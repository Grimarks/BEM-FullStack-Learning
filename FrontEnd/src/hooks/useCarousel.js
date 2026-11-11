import { useCallback, useEffect, useRef, useState } from "react";
export function useCarousel(itemCount = 0) {
    const trackRef = useRef(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    const update = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        setCanPrev(track.scrollLeft > 4);
        setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
    }, []);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        update();
        track.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            track.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [update, itemCount]);

    function scrollByCard(direction) {
        const track = trackRef.current;
        if (!track) return;
        const card = track.firstElementChild;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const step = card ? card.offsetWidth + gap : track.clientWidth;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        track.scrollBy({ left: direction * step, behavior: reduceMotion ? "auto" : "smooth" });
    }

    return {
        trackRef,
        canPrev,
        canNext,
        prev: () => scrollByCard(-1),
        next: () => scrollByCard(1),
    };
}
