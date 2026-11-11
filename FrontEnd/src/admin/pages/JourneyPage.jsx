import { Plus } from "lucide-react";
import { adminApi } from "../lib/adminApi.js";
import { useCrud } from "../hooks/useCrud.js";
import { PageHeader, PageError, FormActions, Notice } from "../components/PageHeader.jsx";
import { TextField, TextArea, SelectField } from "../components/Field.jsx";
import { AdminTable, RowActions, MoveButtons, EmptyRow, LoadingRows, FormHeading, cell, rowClass } from "../components/TableParts.jsx";
import AdminButton from "../components/AdminButton.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

const KINDS = ["Pekerjaan", "Pendidikan", "Kursus", "Organisasi", "Lainnya"];
const MONTH = "\\d{4}-(0[1-9]|1[0-2])";

const empty = { title: "", org: "", kind: "", startDate: "", endDate: "", extra: "", description: "" };
const fromApi = (item) => ({ ...empty, ...item, endDate: item.endDate ?? (item.id ? "sekarang" : "") });
const toApi = (values) => {
  const end = values.endDate.trim();
  return { ...values, endDate: end === "" || end.toLowerCase() === "sekarang" ? null : end };
};
const year = (date) => (date ? date.slice(0, 4) : "");
const period = (item) => `${year(item.startDate)} — ${item.endDate ? year(item.endDate) : "sekarang"}`;

const columns = [
  { label: "Judul", className: "pl-14" },
  { label: "Organisasi" },
  { label: "Kategori" },
  { label: "Tanggal" },
  { label: "Aksi", className: "w-36" },
];

export default function JourneyPage() {
  const crud = useCrud(adminApi.journey, empty, { fromApi, toApi });
  const { form } = crud;

  return (
    <>
      <PageHeader
        title="Perjalanan"
        description="Tambah, ubah, hapus, dan urutkan entri perjalanan."
        action={
          <AdminButton onClick={crud.startCreate}>
            <Plus className="size-4" aria-hidden="true" /> Tambah entri
          </AdminButton>
        }
      />

      <div className="mt-8">
        {crud.status === "error" && !crud.items.length ? (
          <PageError error={crud.error} onRetry={crud.reload} />
        ) : (
          <AdminTable columns={columns}>
            {crud.status === "loading" && !crud.items.length ? (
              <LoadingRows colSpan={columns.length} />
            ) : crud.items.length === 0 ? (
              <EmptyRow colSpan={columns.length} />
            ) : (
              crud.items.map((item, index) => (
                <tr key={item.id} className={rowClass}>
                  <td className={cell}>
                    <div className="flex items-center gap-4">
                      <MoveButtons name={item.title} index={index} count={crud.items.length} onMove={crud.move} />
                      <span className="font-semibold">{item.title}</span>
                    </div>
                  </td>
                  <td className={cell}>{item.org}</td>
                  <td className={`${cell} text-zinc-500`}>{item.kind}</td>
                  <td className={`${cell} whitespace-nowrap text-zinc-500`}>{period(item)}</td>
                  <td className={cell}>
                    <RowActions name={item.title} onEdit={() => crud.startEdit(item)} onDelete={() => crud.askDelete(item)} />
                  </td>
                </tr>
              ))
            )}
          </AdminTable>
        )}
        {crud.orderError && (
          <Notice tone="error" className="mt-4">
            Urutan gagal disimpan: {crud.orderError}
          </Notice>
        )}
      </div>

      <section ref={crud.formRef} className="mt-16 scroll-mt-6" aria-label="Formulir entri">
        <FormHeading title="Formulir entri" editingName={crud.isEditing ? form.values.title : null} />
        <form onSubmit={form.submit} className="mt-6">
          <div className="grid gap-x-10 gap-y-6 md:grid-cols-3">
            <TextField label="Judul" placeholder="Masukkan judul" required {...form.bind("title")} />
            <TextField label="Institusi / organisasi" placeholder="Masukkan organisasi" required {...form.bind("org")} />
            <SelectField label="Kategori" placeholder="Pilih kategori" options={KINDS} required {...form.bind("kind")} />
          </div>
          <div className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-[1fr_1fr_2fr]">
            <TextField
              label="Tanggal mulai"
              placeholder="TTTT-BB"
              pattern={MONTH}
              title="Format: TTTT-BB, contoh 2024-03"
              required
              {...form.bind("startDate")}
            />
            <TextField
              label="Tanggal selesai"
              placeholder="TTTT-BB atau sekarang"
              pattern={`${MONTH}|[Ss]ekarang`}
              title="Format: TTTT-BB, atau tulis sekarang"
              {...form.bind("endDate")}
            />
            <TextField label="Informasi tambahan" placeholder="Informasi opsional" {...form.bind("extra")} />
          </div>
          <TextArea label="Deskripsi" placeholder="Tulis deskripsi entri..." rows={3} className="mt-6" {...form.bind("description")} />

          <FormActions onCancel={crud.cancelEdit} saving={form.saving} status={form.status} />
        </form>
      </section>

      <ConfirmDialog
        open={crud.deleteTarget !== null}
        description={`"${crud.deleteTarget?.title}" akan dihapus. Tindakan ini tidak dapat dibatalkan.`}
        busy={crud.deleting}
        error={crud.deleteError}
        onConfirm={crud.confirmDelete}
        onCancel={crud.cancelDelete}
      />
    </>
  );
}
