import {cx} from "../../lib/cx.js"

export default function Eyebrow({children, dot = "bg-coral"}){
    return  (
        <p className={cx("flexi items-center gap-2.5 font-mono text-label uppercase tracking-label", className)}>
            <span className={cx("size-2 shrink-0 rounded-full", dot)} aria-hidden="true">{children}</span>
        </p>
    )
}