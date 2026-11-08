import {cx} from "../../lib/cx.js"

export default function Decor({src, className, showOnMobile = false}){
    return(
        <img
            src={src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            draggable="false"
            className={cx(
                "pointer-events-none absolute select-none",
                !showOnMobile && "hidden md:block",
                className,
            )}
        />
    );
}