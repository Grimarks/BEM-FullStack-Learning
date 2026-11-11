import { useEffect, useId, useRef } from "react";
import AdminButton from "./AdminButton.jsx";
import { Notice } from "./PageHeader.jsx";

export default function ConfirmDialog({
  open,
  title = "Hapus item ini?",
  description = "Tindakan ini tidak dapat dibatalkan.",
  confirmLabel = "Hapus",
  busy = false,
  error,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel();
      }}
      className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-2xl border border-zinc-200 bg-white p-0 text-zinc-900 shadow-xl backdrop:bg-zinc-900/40"
    >
      {open && (
        <>
          <div className="px-6 pt-6 pb-5 sm:px-8 sm:pt-8">
            <h2 id={titleId} className="text-2xl font-semibold">
              {title}
            </h2>
            <p className="mt-3 text-zinc-500">{description}</p>
            {error && <Notice tone="error" className="mt-4">{error}</Notice>}
          </div>
          <div className="flex justify-end gap-3 border-t border-zinc-200 px-6 py-5 sm:px-8 sm:py-6">
            <AdminButton variant="secondary" onClick={onCancel} disabled={busy} autoFocus className="w-32 sm:w-40">
              Batal
            </AdminButton>
            <AdminButton variant="danger" onClick={onConfirm} busy={busy} className="w-32 sm:w-40">
              {confirmLabel}
            </AdminButton>
          </div>
        </>
      )}
    </dialog>
  );
}
