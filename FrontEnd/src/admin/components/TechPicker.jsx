import { useId, useRef, useState } from "react";
import { Plus, Upload, X, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { TechLogo, techName } from "../../components/ui/Icons.jsx";
import { adminApi } from "../lib/adminApi.js";
import { moveItem, removeAt, tempId } from "../lib/list.js";
import AdminButton from "./AdminButton.jsx";

const LIBRARY = ["react", "nodejs", "typescript", "postgresql", "figma"];

export function TechIcon({ item, className = "size-6" }) {
  if (item.iconUrl) return <img src={item.iconUrl} alt="" className={`${className} object-contain`} />;
  if (item.iconKey) return <TechLogo id={item.iconKey} className={className} />;
  return <span className={`${className} rounded bg-zinc-200`} aria-hidden="true" />;
}

export default function TechPicker({ label = "Teknologi", value, onChange, hint }) {
  const labelId = useId();
  const fileRef = useRef(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [draft, setDraft] = useState({ name: "", iconKey: "", iconUrl: null });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  function openPanel({ upload = false } = {}) {
    setDraft({ name: "", iconKey: "", iconUrl: null });
    setError(null);
    setPanelOpen(true);
    if (upload) fileRef.current.click();
  }

  async function handleFile(file) {
    if (!file) return;
    setPanelOpen(true);
    setUploading(true);
    setError(null);
    try {
      const { url } = await adminApi.upload(file);
      setDraft((d) => ({ ...d, iconKey: "", iconUrl: url, name: d.name || file.name.replace(/\.[^.]+$/, "") }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function addDraft() {
    const name = draft.name.trim();
    if (!name) return setError("Isi nama teknologinya dulu.");
    const item = {
      id: draft.iconKey || tempId(),
      name,
      iconKey: draft.iconKey || null,
      iconUrl: draft.iconUrl,
    };
    onChange([...value, item]);
    setPanelOpen(false);
  }

  const used = new Set(value.map((t) => t.iconKey));

  return (
    <div role="group" aria-labelledby={labelId}>
      <p id={labelId} className="text-sm font-semibold text-zinc-900">
        {label}
      </p>

      {value.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-3">
          {value.map((item, index) => (
            <li key={item.id} className="flex h-14 items-center gap-2 rounded-lg border border-zinc-200 pr-1.5 pl-3">
              <TechIcon item={item} />
              <span className="mr-2 text-[15px]">{item.name}</span>
              <button
                type="button"
                onClick={() => onChange(moveItem(value, index, -1))}
                disabled={index === 0}
                aria-label={`Geser ${item.name} ke kiri`}
                className="grid size-7 place-items-center rounded text-zinc-500 hover:bg-zinc-100 disabled:opacity-30"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onChange(moveItem(value, index, 1))}
                disabled={index === value.length - 1}
                aria-label={`Geser ${item.name} ke kanan`}
                className="grid size-7 place-items-center rounded text-zinc-500 hover:bg-zinc-100 disabled:opacity-30"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onChange(removeAt(value, index))}
                aria-label={`Hapus ${item.name}`}
                className="grid size-7 place-items-center rounded text-zinc-500 hover:bg-zinc-100 hover:text-red-600"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {panelOpen ? (
        <div
          className="mt-3 flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4"
          onKeyDown={(event) => {
            if (event.key === "Enter" && event.target.tagName === "INPUT") {
              event.preventDefault();
              addDraft();
            }
          }}
        >
          <label className="flex min-w-40 flex-1 flex-col gap-1.5 text-sm font-semibold">
            Ikon pustaka
            <select
              value={draft.iconKey}
              onChange={(event) => {
                const key = event.target.value;
                setDraft({ iconKey: key, iconUrl: null, name: key ? techName(key) : draft.name });
              }}
              className="h-11 rounded-lg border border-zinc-200 bg-white px-3 font-normal"
            >
              <option value="">{draft.iconUrl ? "Ikon unggahan" : "Pilih ikon…"}</option>
              {LIBRARY.filter((key) => !used.has(key)).map((key) => (
                <option key={key} value={key}>
                  {techName(key)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex min-w-40 flex-1 flex-col gap-1.5 text-sm font-semibold">
            Nama teknologi
            <input
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              placeholder="mis. Vue"
              className="h-11 rounded-lg border border-zinc-200 bg-white px-3 font-normal"
            />
          </label>
          <div className="grid size-11 place-items-center rounded-lg border border-zinc-200 bg-white" aria-hidden="true">
            {uploading ? <LoaderCircle className="size-5 animate-spin" /> : <TechIcon item={draft} />}
          </div>
          <div className="flex gap-2">
            <AdminButton variant="secondary" onClick={() => setPanelOpen(false)}>
              Batal
            </AdminButton>
            <AdminButton onClick={addDraft} disabled={uploading}>
              Tambah
            </AdminButton>
          </div>
          {error && (
            <p role="alert" className="w-full text-xs text-red-600">
              {error}
            </p>
          )}
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-3">
        <AdminButton variant="secondary" onClick={() => openPanel()}>
          <Plus className="size-4" aria-hidden="true" /> Tambah teknologi
        </AdminButton>
        <AdminButton variant="secondary" onClick={() => openPanel({ upload: true })}>
          <Upload className="size-4" aria-hidden="true" /> Unggah ikon
        </AdminButton>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/svg+xml,image/png"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          handleFile(event.target.files[0]);
          event.target.value = "";
        }}
      />
      {hint && <p className="mt-2 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}
