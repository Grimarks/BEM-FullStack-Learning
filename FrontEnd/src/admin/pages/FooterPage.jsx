import { useState } from "react";
import { Plus } from "lucide-react";
import { useFetch } from "../../hooks/useFetch.js";
import { ContactIcon } from "../../components/ui/Icons.jsx";
import { adminApi } from "../lib/adminApi.js";
import { useForm } from "../hooks/useForm.js";
import { moveItem, replaceAt, removeAt, tempId } from "../lib/list.js";
import { PageHeader, PageLoading, PageError, FormActions } from "../components/PageHeader.jsx";
import { TextField, TextArea, SelectField } from "../components/Field.jsx";
import { AdminTable, RowActions, MoveButtons, EmptyRow, cell, rowClass } from "../components/TableParts.jsx";
import AdminButton from "../components/AdminButton.jsx";

const PLATFORMS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "cv", label: "CV" },
  { value: "instagram", label: "Instagram" },
  { value: "github", label: "GitHub" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "link", label: "Tautan lain" },
];
const platformName = (value) => PLATFORMS.find((p) => p.value === value)?.label ?? value;

const columns = [
  { label: "Platform / ikon", className: "pl-14" },
  { label: "Nama akun / aksi" },
  { label: "URL tujuan" },
  { label: "Aksi", className: "w-36" },
];

function FooterForm({ initial }) {
  const form = useForm(initial, adminApi.saveFooter);
  const socials = form.values.socials ?? [];
  const [selected, setSelected] = useState(socials.length ? 0 : null);
  const current = selected !== null ? socials[selected] : null;

  const setSocials = (next) => form.set("socials", next);

  function addSocial() {
    setSocials([...socials, { id: tempId(), platform: "link", label: "", url: "" }]);
    setSelected(socials.length);
  }

  function updateCurrent(field, value) {
    setSocials(replaceAt(socials, selected, { ...current, [field]: value }));
  }

  function remove(index) {
    setSocials(removeAt(socials, index));
    if (selected === index) setSelected(null);
    else if (selected > index) setSelected(selected - 1);
  }

  function move(index, delta) {
    const next = moveItem(socials, index, delta);
    setSocials(next);
    if (selected === index) setSelected(index + delta);
    else if (selected === index + delta) setSelected(index);
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
              const name = platformName(social.platform);
              return (
                <tr key={social.id} className={`${rowClass} ${selected === index ? "bg-zinc-50" : ""}`}>
                  <td className={cell}>
                    <div className="flex items-center gap-4">
                      <MoveButtons name={name} index={index} count={socials.length} onMove={move} />
                      <ContactIcon type={social.platform} className="size-6" />
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
          <div className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-[1fr_2fr_14rem]">
            <TextField
              label="Nama akun / aksi"
              placeholder="@namaakun"
              value={current.label}
              onChange={(e) => updateCurrent("label", e.target.value)}
            />
            <TextField
              label="URL tujuan"
              placeholder="https://url-tujuan"
              value={current.url}
              onChange={(e) => updateCurrent("url", e.target.value)}
            />
            <SelectField
              label="Pilih ikon"
              options={PLATFORMS}
              value={current.platform}
              onChange={(e) => updateCurrent("platform", e.target.value)}
            />
          </div>
          {current.platform === "cv" && (
            <p className="mt-4 rounded-lg bg-zinc-100 px-4 py-3 text-sm text-zinc-500">
              CV: tautan membuka atau mengunduh dokumen. Boleh berupa file di situs (/cv.pdf) atau link lengkap.
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
