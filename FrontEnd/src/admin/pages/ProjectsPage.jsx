import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { adminApi } from "../lib/adminApi.js";
import { useCrud } from "../hooks/useCrud.js";
import { replaceAt, removeAt } from "../lib/list.js";
import { PageHeader, PageError, FormActions } from "../components/PageHeader.jsx";
import { TextField, TextArea, SelectField } from "../components/Field.jsx";
import { AdminTable, RowActions, Thumb, EmptyRow, LoadingRows, FormHeading, cell, rowClass } from "../components/TableParts.jsx";
import AdminButton from "../components/AdminButton.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import ImageUpload from "../components/ImageUpload.jsx";
import TechPicker from "../components/TechPicker.jsx";

const CATEGORIES = ["Aplikasi web", "Aplikasi mobile", "Desain produk", "API / Backend", "Lainnya"];
const STATUSES = ["Konsep", "Berjalan", "Selesai"];

const empty = {
  title: "",
  category: "",
  categoryLong: "",
  status: "",
  imageUrl: "",
  summary: "",
  date: "",
  demoUrl: "",
  githubUrl: "",
  tech: [],
  links: [],
};

const fromApi = (item) => ({ ...empty, ...item });
const toApi = (values) => ({
  ...values,
  categoryLong: values.categoryLong || values.category,
  links: values.links.filter((l) => l.label.trim() || l.url.trim()),
});

const columns = [
  { label: "Proyek" },
  { label: "Kategori" },
  { label: "Tanggal" },
  { label: "Teknologi" },
  { label: "Aksi", className: "w-36" },
];
function LinksEditor({ value, onChange }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-zinc-900">Tautan tambahan</legend>
      <ul className="mt-2 space-y-3">
        {value.map((link, index) => (
          <li key={index} className="flex flex-wrap gap-3 sm:flex-nowrap">
            <input
              value={link.label}
              onChange={(e) => onChange(replaceAt(value, index, { ...link, label: e.target.value }))}
              placeholder="Label, mis. Figma"
              aria-label={`Label tautan ${index + 1}`}
              className="h-12 w-full rounded-lg border border-zinc-200 px-4 sm:w-56"
            />
            <input
              type="url"
              value={link.url}
              onChange={(e) => onChange(replaceAt(value, index, { ...link, url: e.target.value }))}
              placeholder="https://"
              aria-label={`URL tautan ${index + 1}`}
              className="h-12 min-w-0 flex-1 rounded-lg border border-zinc-200 px-4"
            />
            <AdminButton variant="icon" className="size-12" onClick={() => onChange(removeAt(value, index))} aria-label={`Hapus tautan ${index + 1}`}>
              <X className="size-4" aria-hidden="true" />
            </AdminButton>
          </li>
        ))}
      </ul>
      <AdminButton variant="secondary" className="mt-3" onClick={() => onChange([...value, { label: "", url: "" }])}>
        <Plus className="size-4" aria-hidden="true" /> Tambah label dan URL tujuan
      </AdminButton>
    </fieldset>
  );
}

export default function ProjectsPage() {
  const crud = useCrud(adminApi.projects, empty, { fromApi, toApi });
  const { form } = crud;
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const visible = q
    ? crud.items.filter((p) => `${p.title} ${p.category} ${(p.tech ?? []).map((t) => t.name).join(" ")}`.toLowerCase().includes(q))
    : crud.items;

  return (
    <>
      <PageHeader title="Proyek" description="Cari dan kelola detail proyek." />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <label className="relative w-full max-w-md">
          <span className="sr-only">Cari proyek</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari proyek..."
            className="h-12 w-full rounded-lg border border-zinc-200 pr-4 pl-12 focus:border-zinc-900 focus:outline-none"
          />
        </label>
        <AdminButton onClick={crud.startCreate}>
          <Plus className="size-4" aria-hidden="true" /> Tambah proyek
        </AdminButton>
      </div>

      <div className="mt-6">
        {crud.status === "error" && !crud.items.length ? (
          <PageError error={crud.error} onRetry={crud.reload} />
        ) : (
          <AdminTable columns={columns}>
            {crud.status === "loading" && !crud.items.length ? (
              <LoadingRows colSpan={columns.length} />
            ) : visible.length === 0 ? (
              <EmptyRow colSpan={columns.length}>{q ? `Tidak ada proyek yang cocok dengan "${query}".` : undefined}</EmptyRow>
            ) : (
              visible.map((item) => (
                <tr key={item.id} className={rowClass}>
                  <td className={cell}>
                    <div className="flex items-center gap-5">
                      <Thumb src={item.imageUrl} />
                      <span className="font-semibold">{item.title}</span>
                    </div>
                  </td>
                  <td className={`${cell} text-zinc-500`}>{item.category}</td>
                  <td className={`${cell} text-zinc-500`}>{item.date?.slice(0, 4)}</td>
                  <td className={`${cell} text-sm text-zinc-500`}>{(item.tech ?? []).map((t) => t.name).join(" · ")}</td>
                  <td className={cell}>
                    <RowActions name={item.title} onEdit={() => crud.startEdit(item)} onDelete={() => crud.askDelete(item)} />
                  </td>
                </tr>
              ))
            )}
          </AdminTable>
        )}
      </div>

      <section ref={crud.formRef} className="mt-16 scroll-mt-6" aria-label="Formulir proyek">
        <FormHeading title="Formulir proyek" editingName={crud.isEditing ? form.values.title : null} />
        <form onSubmit={form.submit} className="mt-6">
          <div className="grid gap-x-10 gap-y-6 lg:grid-cols-[19rem_1fr]">
            <ImageUpload
              label="Pratinjau gambar"
              caption="Unggah gambar sampul"
              value={form.values.imageUrl}
              onChange={(url) => form.set("imageUrl", url)}
              boxClassName="aspect-[3/2]"
            />
            <div className="grid content-start gap-x-10 gap-y-5 md:grid-cols-2">
              <TextField label="Judul proyek" placeholder="Masukkan judul" required {...form.bind("title")} />
              <div className="grid grid-cols-2 gap-4">
                <SelectField label="Kategori" placeholder="Pilih kategori" options={CATEGORIES} required {...form.bind("category")} />
                <SelectField label="Status" placeholder="Pilih status" options={STATUSES} {...form.bind("status")} />
              </div>
              <TextArea label="Deskripsi" placeholder="Tulis deskripsi proyek..." rows={3} className="md:col-span-2" {...form.bind("summary")} />
            </div>
          </div>

          <div className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-[1fr_2fr_2fr]">
            <TextField
              label="Tanggal"
              placeholder="TTTT-BB"
              pattern="\d{4}-(0[1-9]|1[0-2])"
              title="Format: TTTT-BB, contoh 2025-03"
              {...form.bind("date")}
            />
            <TextField label="URL demo langsung" type="url" placeholder="https://" {...form.bind("demoUrl")} />
            <TextField label="URL GitHub" type="url" placeholder="https://" {...form.bind("githubUrl")} />
          </div>

          <div className="mt-6">
            <TechPicker label="Ikon teknologi" value={form.values.tech} onChange={(tech) => form.set("tech", tech)} />
          </div>

          <div className="mt-6">
            <LinksEditor value={form.values.links} onChange={(links) => form.set("links", links)} />
          </div>

          <FormActions onCancel={crud.cancelEdit} saving={form.saving} status={form.status} />
        </form>
      </section>

      <ConfirmDialog
        open={crud.deleteTarget !== null}
        description={`Proyek "${crud.deleteTarget?.title}" akan dihapus. Tindakan ini tidak dapat dibatalkan.`}
        busy={crud.deleting}
        error={crud.deleteError}
        onConfirm={crud.confirmDelete}
        onCancel={crud.cancelDelete}
      />
    </>
  );
}
