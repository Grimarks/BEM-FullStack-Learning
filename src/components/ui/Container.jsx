import {cx} from "../../lib/cx.js"

export default function Container({className, children}){
    return (
        <div className="px-5 md:px-8">
            <div className={cx("mx-auto w-full max-w-page", className)}>{children}</div>
        </div>
    )
}