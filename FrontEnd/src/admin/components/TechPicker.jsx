// ============================================================================
// ADMIN · LANGKAH A13 dari 21
// TechPicker.jsx: daftar teknologi berikon (React, Go, Node.js, ...).
// Dipakai di Profil dan Proyek.
//
// Di backend, teknologi adalah KATALOG tersendiri (tabel `teknologi`), lalu
// profil/proyek hanya MENUNJUK ke katalog itu (tabel relasi). Jadi di sini:
//   - "Pilih dari katalog"   → pilih teknologi yang sudah ada
//   - "Teknologi baru"       → buat dulu di katalog (boleh dengan ikon unggahan),
//                              lalu langsung dipilih
// Daftar yang dipilih baru dikirim ke server saat "Simpan perubahan".
//
// Bentuk satu item: { id: 2, name: "React", iconUrl: "https://...", role: "Frontend" }
//   role hanya untuk proyek (prop withRole), misalnya "Frontend" atau "Backend".
//
// Komponen ini "controlled": ia TIDAK menyimpan daftar terpilih sendiri.
// Ia menerima `value` (array) dan memanggil `onChange(arrayBaru)`.
//
// Konsep baru:
//   - komponen yang mengubah array: tambah [...lama, baru], hapus (filter),
//     geser (moveItem dari lib/list.js)
//   - menahan Enter: di dalam <form> induk, Enter akan men-submit formulir,
//     jadi di panel ini Enter dicegat dengan onKeyDown
//
// Sebelumnya: LANGKAH A12 (ImageUpload.jsx) · Berikutnya: LANGKAH A14 (pages/ProfilePage.jsx)
// ============================================================================

import { useId, useRef, useState } from "react";
import { Plus, Upload, X, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { TechLogo } from "../../components/ui/Icons.jsx";
import { useFetch } from "../../hooks/useFetch.js";
import { adminApi } from "../lib/adminApi.js";
import { moveItem, removeAt, replaceAt } from "../lib/list.js";
import AdminButton from "./AdminButton.jsx";

// Peran teknologi di proyek (kolom "kategori" di tabel teknologi_proyek)
const ROLES = ["Frontend", "Backend", "Database", "Mobile", "DevOps", "Desain", "Lainnya"];

// "Node.js" → "nodejs": kunci ikon bawaan di components/ui/Icons.jsx
const builtInKey = (name) => String(name).toLowerCase().replace(/[^a-z0-9]/g, "");

export function TechIcon({ item, className = "size-6" }) {
  if (item.iconUrl) return <img src={item.iconUrl} alt="" className={`${className} object-contain`} />;
  const logo = <TechLogo id={builtInKey(item.name ?? "")} className={className} />;
  // TechLogo mengembalikan null kalau ikonnya tidak ada: tampilkan inisial saja.
  return ["react", "nodejs", "typescript", "postgresql", "figma"].includes(builtInKey(item.name ?? "")) ? (
      logo
  ) : (
      <span className={`${className} grid place-items-center rounded bg-zinc-200 text-[10px] font-bold text-zinc-600`} aria-hidden="true">
      {(item.name ?? "?").slice(0, 2).toUpperCase()}
    </span>
  );
}

const btn = "grid size-7 place-items-center rounded text-zinc-500 hover:bg-zinc-100 disabled:opacity-30";

export default function TechPicker({ label = "Teknologi", value, onChange, hint, withRole = false }) {
  const labelId = useId();
  const fileRef = useRef(null);
  const catalog = useFetch(adminApi.technologies.list);
  const [panel, setPanel] = useState(null); // null | "pick" | "new"
  const [pickId, setPickId] = useState("");
  const [draft, setDraft] = useState({ name: "", iconUrl: null });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const chosen = new Set(value.map((t) => t.id));
  const available = (catalog.data ?? []).filter((t) => !chosen.has(t.id));
  const add = (tech) => onChange([...value, withRole ? { ...tech, role: "Lainnya" } : tech]);

  function open(mode) {
    setError(null);
    setPickId("");
    setDraft({ name: "", iconUrl: null });
    setPanel(mode);
    if (mode === "new-upload") {
      setPanel("new");
      fileRef.current.click();
    }
  }

  function addPicked() {
    const tech = available.find((t) => String(t.id) === pickId);
    if (!tech) return setError("Pilih teknologinya dulu.");
    add(tech);
    setPanel(null);
  }

  async function uploadIcon(file) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { url } = await adminApi.upload(file, "icon");
      setDraft((d) => ({ name: d.name || file.name.replace(/\.[^.]+$/, ""), iconUrl: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function createNew() {
    const name = draft.name.trim();
    if (!name) return setError("Isi nama teknologinya dulu.");
    setBusy(true);
    setError(null);
    try {
      const created = await adminApi.technologies.create({ name, iconUrl: draft.iconUrl });
      add(created);
      catalog.reload();
      setPanel(null);
    } catch (err) {
      setError(err.message); // mis. "Nama teknologi sudah digunakan" → pilih dari katalog saja
    } finally {
      setBusy(false);
    }
  }

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
                    <span className="mr-1 text-[15px]">{item.name}</span>
                    {withRole && (
                        <select
                            value={item.role || "Lainnya"}
                            onChange={(e) => onChange(replaceAt(value, index, { ...item, role: e.target.value }))}
                            aria-label={`Peran ${item.name} di proyek`}
                            className="h-8 rounded border border-zinc-200 bg-white px-1.5 text-xs text-zinc-600"
                        >
                          {[...new Set([...ROLES, item.role || "Lainnya"])].map((r) => (
                              <option key={r}>{r}</option>
                          ))}
                        </select>
                    )}
                    <button type="button" onClick={() => onChange(moveItem(value, index, -1))} disabled={index === 0} aria-label={`Geser ${item.name} ke kiri`} className={btn}>
                      <ChevronLeft className="size-4" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onChange(moveItem(value, index, 1))}
                        disabled={index === value.length - 1}
                        aria-label={`Geser ${item.name} ke kanan`}
                        className={btn}
                    >
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => onChange(removeAt(value, index))} aria-label={`Hapus ${item.name}`} className={`${btn} hover:text-red-600`}>
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  </li>
              ))}
            </ul>
        )}

        {panel && (
            // Panel tambah. BUKAN <form>, karena form di dalam form tidak diizinkan HTML.
            <div
                className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && ["INPUT", "SELECT"].includes(event.target.tagName)) {
                    event.preventDefault();
                    panel === "pick" ? addPicked() : createNew();
                  }
                }}
            >
              <div className="mb-3 flex gap-4 text-sm" role="tablist">
                {[
                  ["pick", "Pilih dari katalog"],
                  ["new", "Teknologi baru"],
                ].map(([mode, text]) => (
                    <button
                        key={mode}
                        type="button"
                        role="tab"
                        aria-selected={panel === mode}
                        onClick={() => open(mode)}
                        className={panel === mode ? "font-semibold text-zinc-900 underline underline-offset-4" : "text-zinc-500 hover:text-zinc-900"}
                    >
                      {text}
                    </button>
                ))}
              </div>

              {panel === "pick" ? (
                  <div className="flex flex-wrap items-end gap-3">
                    <label className="flex min-w-48 flex-1 flex-col gap-1.5 text-sm font-semibold">
                      Teknologi
                      <select value={pickId} onChange={(e) => setPickId(e.target.value)} className="h-11 rounded-lg border border-zinc-200 bg-white px-3 font-normal">
                        <option value="">
                          {catalog.status === "loading" ? "Memuat…" : available.length ? "Pilih teknologi…" : "Semua sudah dipilih"}
                        </option>
                        {available.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                        ))}
                      </select>
                    </label>
                    <AdminButton variant="secondary" onClick={() => setPanel(null)}>
                      Batal
                    </AdminButton>
                    <AdminButton onClick={addPicked}>Tambah</AdminButton>
                  </div>
              ) : (
                  <div className="flex flex-wrap items-end gap-3">
                    <label className="flex min-w-48 flex-1 flex-col gap-1.5 text-sm font-semibold">
                      Nama teknologi
                      <input
                          value={draft.name}
                          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                          placeholder="mis. Go"
                          className="h-11 rounded-lg border border-zinc-200 bg-white px-3 font-normal"
                      />
                    </label>
                    <div className="grid size-11 place-items-center rounded-lg border border-zinc-200 bg-white" aria-hidden="true">
                      {busy ? <LoaderCircle className="size-5 animate-spin" /> : <TechIcon item={draft} />}
                    </div>
                    <AdminButton variant="secondary" onClick={() => fileRef.current.click()} disabled={busy}>
                      <Upload className="size-4" aria-hidden="true" /> {draft.iconUrl ? "Ganti ikon" : "Unggah ikon"}
                    </AdminButton>
                    <AdminButton variant="secondary" onClick={() => setPanel(null)}>
                      Batal
                    </AdminButton>
                    <AdminButton onClick={createNew} busy={busy}>
                      Buat & pilih
                    </AdminButton>
                  </div>
              )}
              {error && (
                  <p role="alert" className="mt-2 text-xs text-red-600">
                    {error}
                  </p>
              )}
            </div>
        )}

        {!panel && (
            <div className="mt-3 flex flex-wrap gap-3">
              <AdminButton variant="secondary" onClick={() => open("pick")}>
                <Plus className="size-4" aria-hidden="true" /> Tambah teknologi
              </AdminButton>
              <AdminButton variant="secondary" onClick={() => open("new-upload")}>
                <Upload className="size-4" aria-hidden="true" /> Unggah ikon
              </AdminButton>
            </div>
        )}
        <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => {
              uploadIcon(event.target.files[0]);
              event.target.value = "";
            }}
        />
        {hint && <p className="mt-2 text-xs text-zinc-500">{hint}</p>}
      </div>
  );
}
