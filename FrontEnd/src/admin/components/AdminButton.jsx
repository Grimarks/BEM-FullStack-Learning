import { LoaderCircle } from "lucide-react";
import { cx } from "../../lib/cx.js";
import { handleLinkClick } from "../lib/router.js";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  primary: "h-11 bg-zinc-900 px-5 text-white hover:bg-zinc-700",
  secondary: "h-11 border border-zinc-200 bg-white px-5 text-zinc-900 hover:bg-zinc-50",
  icon: "size-9 border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
  danger: "h-11 bg-zinc-900 px-5 text-white hover:bg-red-700",
};

export default function AdminButton({ variant = "primary", busy = false, to, className, children, ...props }) {
  const classes = cx(base, variants[variant], className);
  if (to) {
    return (
      <a href={to} onClick={(event) => handleLinkClick(event, to)} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" {...props} disabled={busy || props.disabled} aria-busy={busy || undefined} className={classes}>
      {busy && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
