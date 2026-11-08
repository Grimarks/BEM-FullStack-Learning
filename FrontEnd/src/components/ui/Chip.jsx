import {cx} from "../../lib/cx.js"

const tones = {
    glass: "bg-white/90 text-ink backdrop-blur",
    lime: "bg-lime text-ink",
}

export default function Chip({tone = "glass", className, children}){
    return (
        <span
        className={cx(
            "inline-flex items-center rounded-full px-3 py-1.5 font-mono text-label uppercase tracking-wider",
            tones[tone],
            className,
        )}
        >
            {children}
        </span>
    );
}