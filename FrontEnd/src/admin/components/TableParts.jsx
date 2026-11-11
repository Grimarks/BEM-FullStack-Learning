import { Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { cx } from "../../lib/cx.js";
import AdminButton from "./AdminButton.jsx";

export function AdminTable({ columns, children, minWidth = "48rem" }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[15px]" style={{ minWidth }}>
        <thead className="bg-zinc-100 text-sm text-zinc-500">
          <tr>
            {columns.map((col) => (
              <th key={col.label} scope="col" className={cx("px-6 py-4 font-medium", col.className)}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
export const cell = "px-6 py-5 align-middle";
export const rowClass = "border-b border-zinc-200";

export function RowActions({ name, onEdit, onDelete }) {
  return (
    <div className="flex gap-3">
      <AdminButton variant="icon" onClick={onEdit} aria-label={`Ubah ${name}`}>
        <Pencil className="size-4" aria-hidden="true" />
      </AdminButton>
      <AdminButton variant="icon" onClick={onDelete} aria-label={`Hapus ${name}`}>
        <Trash2 className="size-4" aria-hidden="true" />
      </AdminButton>
    </div>
  );
}

export function MoveButtons({ name, index, count, onMove, disabled }) {
  const btn = "grid size-6 place-items-center rounded text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-30";
  return (
    <div className="flex flex-col">
      <button type="button" className={btn} onClick={() => onMove(index, -1)} disabled={disabled || index === 0} aria-label={`Naikkan ${name}`}>
        <ChevronUp className="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => onMove(index, 1)}
        disabled={disabled || index === count - 1}
        aria-label={`Turunkan ${name}`}
      >
        <ChevronDown className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function Thumb({ src }) {
  return (
    <span className="block size-16 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 sm:size-20">
      {src && <img src={src} alt="" className="size-full object-cover" />}
    </span>
  );
}

export function EmptyRow({ colSpan, children = "Belum ada data. Klik tombol tambah untuk membuat yang pertama." }) {
  return (
    <tr className={rowClass}>
      <td colSpan={colSpan} className="px-6 py-10 text-center text-zinc-500">
        {children}
      </td>
    </tr>
  );
}
export function FormHeading({ title, editingName }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-sm text-zinc-500">
        {editingName ? (
          <>
            Mengubah: <span className="font-semibold text-zinc-900">{editingName}</span>
          </>
        ) : (
          "Menambah data baru"
        )}
      </p>
    </div>
  );
}
export function LoadingRows({ colSpan, rows = 3 }) {
  return Array.from({ length: rows }, (_, i) => (
    <tr key={i} className={rowClass}>
      <td colSpan={colSpan} className="px-6 py-5">
        <div className="h-10 animate-pulse rounded bg-zinc-100" />
      </td>
    </tr>
  ));
}
