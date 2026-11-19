import { useRef, useState } from "react";
import { Upload, LoaderCircle } from "lucide-react";
import { cx } from "../../lib/cx.js";
import { adminApi } from "../lib/adminApi.js";

const ACCEPT = "image/png,image/jpeg,image/webp";

export default function ImageUpload({ value, onChange, purpose, label = "Unggah gambar", caption, className, boxClassName }) {
    const inputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    async function upload(file) {
        if (!file) return;
        setUploading(true);
        setError(null);
        try {
            const { url } = await adminApi.upload(file, purpose);
            onChange(url);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className={className}>
            <button
                type="button"
                onClick={() => inputRef.current.click()}
                onDragOver={(event) => {
                    event.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(event) => {
                    event.preventDefault();
                    setDragOver(false);
                    upload(event.dataTransfer.files[0]);
                }}
                disabled={uploading}
                aria-label={value ? `Ganti gambar: ${label}` : label}
                className={cx(
                    "relative grid w-full place-items-center overflow-hidden rounded-xl border bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200/70",
                    dragOver ? "border-zinc-900" : "border-zinc-200",
                    boxClassName ?? "aspect-square",
                )}
            >
                {value ? (
                    <img src={value} alt="" className="absolute inset-0 size-full object-cover" />
                ) : (
                    <span className="flex flex-col items-center gap-3 p-4 text-sm">
            <Upload className="size-6 text-zinc-600" aria-hidden="true" />
                        {label}
          </span>
                )}
                {uploading && (
                    <span className="absolute inset-0 grid place-items-center bg-white/70">
            <LoaderCircle className="size-6 animate-spin text-zinc-700" aria-hidden="true" />
            <span className="sr-only">Mengunggah…</span>
          </span>
                )}
            </button>

            <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
                onChange={(event) => {
                    upload(event.target.files[0]);
                    event.target.value = "";
                }}
            />

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                {caption && <span className="text-zinc-500">{caption}</span>}
                {value && (
                    <button type="button" onClick={() => onChange("")} className="text-zinc-500 underline hover:text-zinc-900">
                        Hapus gambar
                    </button>
                )}
            </div>
            {error && (
                <p role="alert" className="mt-1 text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
