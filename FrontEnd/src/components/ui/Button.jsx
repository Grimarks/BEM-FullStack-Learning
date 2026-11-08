import {cx} from "../../lib/cx.js"

const variants ={
    cream: "bg-cream text-ink hover:bg-white",
    ghost: "border border-cream/35 bg-plum/60 text-cream backdrop-blur hover:bg-plum hover:border-cream/60",
    dark: "bg-black text-white hover:bg-ink",
};

export default function Button({ href, variant = "cream", className, children, ...props }) {
    const classes = cx(
        "inline-flex items-center justify-center gap-1.5 rounded-full px-6 py-3 text-[15px] font-semibold",
        "transition-colors duration-200",
        variants[variant],
        className,
    );


if(href){
    return(
       <a href={href} className={classes} {...props}>
           {children}
       </a>
    );
}
return (
    <button type="button" className={classes} {...props}>
        {children}
    </button>
);
}