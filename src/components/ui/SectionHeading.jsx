import Eyebrow from "./Eyebrow.jsx";
import {cx} from "../../lib/cx.js"

export default function SectionHeading({ id, eyebrow, dot, line1, line2, tone = "light", align = "left", className }) {
    const dark = tone === "dark";
    return (
        <div className={cx(align === "center" && "text-center", className)}>
            <Eyebrow
                dot={dot}
                className={cx(dark ? "text-cream" : "text-stone", align === "center" && "justify-center")}
            >
                {eyebrow}
            </Eyebrow>
            <h2
                id={id}
                className={cx(
                    "mt-4 font-display text-display tracking-display",
                    dark ? "text-cream" : "text-night",
                )}
            >
                {line1}
                <span className="block text-violet">{line2}</span>
            </h2>
        </div>
    );
}
