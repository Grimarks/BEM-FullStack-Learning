import { CircleCheck, CircleAlert } from "lucide-react";
import { cx } from "../../lib/cx.js";
import AdminButton from "./AdminButton.jsx";

export function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-zinc-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function Notice({ tone = "success", children, className }) {
  if (!children) return null;
  const Icon = tone === "error" ? CircleAlert : CircleCheck;
  return (
    <p
      className={cx(
        "flex items-start gap-2 rounded-lg px-4 py-3 text-sm",
        tone === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700",
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export function FormActions({ onCancel, saving, status, submitLabel = "Simpan perubahan", cancelDisabled }) {
  return (
    <div className="mt-10 border-t border-zinc-200 pt-6">
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-end">
        <div role="status" aria-live="polite" className="sm:mr-auto">
          {status && <Notice tone={status.tone}>{status.message}</Notice>}
        </div>
        <div className="flex gap-3">
          <AdminButton variant="secondary" onClick={onCancel} disabled={saving || cancelDisabled} className="flex-1 sm:w-44 sm:flex-none">
            Batal
          </AdminButton>
          <AdminButton type="submit" busy={saving} className="flex-1 sm:w-auto sm:min-w-[19rem] sm:flex-none">
            {submitLabel}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="mt-10 space-y-4" aria-busy="true" aria-label="Memuat data">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-zinc-100" />
      ))}
    </div>
  );
}

export function PageError({ error, onRetry }) {
  return (
    <div className="mt-10 rounded-xl border border-zinc-200 p-6">
      <Notice tone="error">{error?.message ?? "Gagal memuat data."}</Notice>
      <AdminButton variant="secondary" onClick={onRetry} className="mt-4">
        Coba lagi
      </AdminButton>
    </div>
  );
}
