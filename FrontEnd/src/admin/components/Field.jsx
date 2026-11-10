import { useId } from "react";
import { cx } from "../../lib/cx.js";

const inputClass =
  "w-full rounded-lg border bg-white px-4 py-2.5 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none";
function FieldShell({ id, label, hint, error, className, children }) {
  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-zinc-900">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-msg`} className="text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-msg`} className="text-xs text-zinc-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
function a11yProps(id, error, hint) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error || hint ? `${id}-msg` : undefined,
  };
}

export function TextField({ label, hint, error, className, ...props }) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <input
        {...a11yProps(id, error, hint)}
        className={cx(inputClass, "h-12", error ? "border-red-400" : "border-zinc-200")}
        {...props}
      />
    </FieldShell>
  );
}

export function TextArea({ label, hint, error, className, rows = 3, ...props }) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <textarea
        {...a11yProps(id, error, hint)}
        rows={rows}
        className={cx(inputClass, "resize-y", error ? "border-red-400" : "border-zinc-200")}
        {...props}
      />
    </FieldShell>
  );
}
export function SelectField({ label, hint, error, className, options, placeholder = "Pilih…", ...props }) {
  const id = useId();
  const items = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  if (props.value && !items.some((o) => o.value === props.value)) {
    items.push({ value: props.value, label: props.value });
  }
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <select
        {...a11yProps(id, error, hint)}
        className={cx(inputClass, "h-12", !props.value && "!text-zinc-400", error ? "border-red-400" : "border-zinc-200")}
        {...props}
      >
        <option value="">{placeholder}</option>
        {items.map((o) => (
          <option key={o.value} value={o.value} className="text-zinc-900">
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
