import { useRef, useState } from "react";
import { Plus, Upload } from "lucide-react";
import { useFetch } from "../../hooks/useFetch.js";
import { ContactIcon } from "../../components/ui/Icons.jsx";
import { adminApi } from "../lib/adminApi.js";
import { useForm } from "../hooks/useForm.js";
import { moveItem, replaceAt, removeAt, tempId } from "../lib/list.js";
import { PageHeader, PageLoading, PageError, FormActions } from "../components/PageHeader.jsx";
import { TextField, TextArea } from "../components/Field.jsx";
import { LINK_PATTERN, LINK_HINT } from "../../lib/mappers.js";
import { AdminTable, RowActions, MoveButtons, EmptyRow, cell, rowClass } from "../components/TableParts.jsx";
import AdminButton from "../components/AdminButton.jsx";

const PLATFORM_SUGGESTIONS = ["LinkedIn", "CV", "Instagram", "GitHub", "WhatsApp", "Email", "Website"];

const BUILT_IN = ["linkedin", "cv", "instagram", "github", "whatsapp", "email"];
export function SocialIcon({ social, className = "size-6" }) {
  if (social.iconUrl) return <img src={social.iconUrl} alt="" className={`${className} object-contain`} />;
  const key = social.platform.toLowerCase().replace(/[^a-z]/g, "");
  return <ContactIcon type={BUILT_IN.includes(key) ? key : "link"} className={className} />;
}

const loadSocialIcons = () => adminApi.icons.list("media_sosial");

const columns = [
  { label: "Platform / ikon", className: "pl-14" },
  { label: "Nama akun / aksi" },
  { label: "URL tujuan" },
  { label: "Aksi", className: "w-36" },
];

function FooterForm({ initial }) {
  const form = useForm(initial, adminApi.saveFooter);
  const icons = useFetch(loadSocialIcons);
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [iconError, setIconError] = useState(null);
  const socials = form.values.socials ?? [];
  const [selected, setSelected] = useState(socials.length ? 0 : null); // index baris yang sedang diubah
  const current = selected !== null ? socials[selected] : null;

  const setSocials = (next) => form.set("socials", next);

  function addSocial() {
    setSocials([...socials, { id: tempId(), platform: "", label: "", url: "", iconId: null, iconUrl: null }]);
    setSelected(socials.length);
  }

  function updateCurrent(changes) {
    setSocials(replaceAt(socials, selected, { ...current, ...changes }));
  }

  function remove(index) {
    setSocials(removeAt(socials, index));
    if (selected === index) setSelected(null);
    else if (selected > index) setSelected(selected - 1);
  }

  function move(index, delta) {
    setSocials(moveItem(socials, index, delta));
    if (selected === index) setSelected(index + delta);
    else if (selected === index + delta) setSelected(index);
  }

  async function uploadIcon(file) {
    if (!file) return;
    setUploading(true);
    setIconError(null);
    try {
      const { url } = await adminApi.upload(file, "icon");
      const icon = await adminApi.icons.create({ name: current.platform || file.name, url, category: "media_sosial" });
      updateCurrent({ iconId: icon.id, iconUrl: icon.url });
      icons.reload();
    } catch (err) {
      setIconError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={form.submit} className="mt-10">
      <TextArea label="Deskripsi footer" placeholder="Tulis deskripsi footer..." rows={3} {...form.bind("description")} />
      <div className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-2">
        <TextField label="Teks hak cipta" placeholder="© 2025 Nama Anda" {...form.bind("copyright")} />
        <TextField label="Teks footer tambahan" placeholder="Masukkan teks tambahan" {...form.bind("extraText")} />
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Media sosial</h2>
        <AdminButton onClick={addSocial}>
          <Plus className="size-4" aria-hidden="true" /> Tambah tautan
        </AdminButton>
      </div>

      <div className="mt-6">
        <AdminTable columns={columns}>
          {socials.length === 0 ? (
            <EmptyRow colSpan={columns.length}>Belum ada tautan.</EmptyRow>
          ) : (
            socials.map((social, index) => {
              const name = social.platform || "Tautan baru";
              return (
                <tr key={social.id} className={`${rowClass} ${selected === index ? "bg-zinc-50" : ""}`}>
                  <td className={cell}>
                    <div className="flex items-center gap-4">
                      <MoveButtons name={name} index={index} count={socials.length} onMove={move} />
                      <SocialIcon social={social} />
                      <span>{name}</span>
                    </div>
                  </td>
                  <td className={`${cell} text-zinc-500`}>{social.label || "—"}</td>
                  <td className={`${cell} max-w-xs truncate text-sm text-zinc-500`}>{social.url || "—"}</td>
                  <td className={cell}>
                    <RowActions name={name} onEdit={() => setSelected(index)} onDelete={() => remove(index)} />
                  </td>
                </tr>
              );
            })
          )}
        </AdminTable>
      </div>

      {current && (
        <section className="mt-10" aria-label="Ubah tautan sosial">
          <h2 className="text-2xl font-semibold">Ubah tautan sosial / CV</h2>
          <div className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-[1fr_1fr_2fr]">
            <TextField
              label="Platform"
              placeholder="mis. LinkedIn"
              list="platform-suggestions"
              required
              value={current.platform}
              onChange={(e) => updateCurrent({ platform: e.target.value })}
            />
            <datalist id="platform-suggestions">
              {PLATFORM_SUGGESTIONS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
            <TextField
              label="Nama akun / aksi"
              placeholder="@namaakun"
              required
              value={current.label}
              onChange={(e) => updateCurrent({ label: e.target.value })}
            />
            <TextField
              label="URL tujuan"
              placeholder="https://url-tujuan"
              pattern={LINK_PATTERN}
              title={LINK_HINT}
              required
              value={current.url}
              onChange={(e) => updateCurrent({ url: e.target.value })}
            />
          </div>

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold text-zinc-900">Pilih ikon</legend>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="grid size-12 place-items-center rounded-lg border border-zinc-200" aria-hidden="true">
                <SocialIcon social={current} />
              </span>
              <select
                value={current.iconId ?? ""}
                onChange={(e) => {
                  const icon = (icons.data ?? []).find((i) => String(i.id) === e.target.value);
                  updateCurrent({ iconId: icon?.id ?? null, iconUrl: icon?.url ?? null });
                }}
                aria-label="Ikon"
                className="h-12 min-w-56 rounded-lg border border-zinc-200 bg-white px-3"
              >
                <option value="">Ikon bawaan (dari nama platform)</option>
                {(icons.data ?? []).map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
              <AdminButton variant="secondary" busy={uploading} onClick={() => fileRef.current.click()}>
                <Upload className="size-4" aria-hidden="true" /> Unggah ikon
              </AdminButton>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
                onChange={(e) => {
                  uploadIcon(e.target.files[0]);
                  e.target.value = "";
                }}
              />
            </div>
            {iconError && (
              <p role="alert" className="mt-2 text-xs text-red-600">
                {iconError}
              </p>
            )}
          </fieldset>

          {current.platform.toLowerCase() === "cv" && (
            <p className="mt-4 rounded-lg bg-zinc-100 px-4 py-3 text-sm text-zinc-500">
              CV: tautan membuka atau mengunduh dokumen. Boleh file di situs sendiri (/cv.pdf, taruh filenya di folder
              public/) atau link lengkap seperti Google Drive.
            </p>
          )}
        </section>
      )}

      <FormActions
        onCancel={() => {
          form.reset();
          setSelected(null);
        }}
        saving={form.saving}
        status={form.status}
        cancelDisabled={!form.dirty}
      />
    </form>
  );
}

export default function FooterPage() {
  const { status, data, error, reload } = useFetch(adminApi.getFooter);

  return (
    <>
      <PageHeader title="Footer & Sosial" description="Kelola teks footer dan tautan LinkedIn, CV, serta Instagram." />
      {status === "error" ? (
        <PageError error={error} onRetry={reload} />
      ) : !data ? (
        <PageLoading />
      ) : (
        <FooterForm initial={data} />
      )}
    </>
  );
}
