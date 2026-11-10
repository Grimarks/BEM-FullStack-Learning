import { Plus } from "lucide-react";
import { adminApi } from "../lib/adminApi.js";
import { useCrud } from "../hooks/useCrud.js";
import { PageHeader, PageError, FormActions } from "../components/PageHeader.jsx";
import { TextField } from "../components/Field.jsx";
import { AdminTable, RowActions, Thumb, EmptyRow, LoadingRows, FormHeading, cell, rowClass } from "../components/TableParts.jsx";
import AdminButton from "../components/AdminButton.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import ImageUpload from "../components/ImageUpload.jsx";

const empty = {
  title: "",
  issuer: "",
  issuedAt: "",
  expiresAt: "",
  credentialId: "",
  credentialUrl: "",
  imageUrl: "",
  description: "",
};
const fromApi = (item) => ({ ...empty, ...item, expiresAt: item.expiresAt ?? "" });
const toApi = (values) => ({ ...values, expiresAt: values.expiresAt || null });

const columns = [
  { label: "Sertifikat" },
  { label: "Organisasi" },
  { label: "Tanggal terbit" },
  { label: "Aksi", className: "w-36" },
];

export default function CertificatesPage() {
  const crud = useCrud(adminApi.certificates, empty, { fromApi, toApi });
  const { form } = crud;

  return (
    <>
      <PageHeader
        title="Sertifikasi"
        description="Kelola sertifikat dan tautan kredensial."
        action={
          <AdminButton onClick={crud.startCreate}>
            <Plus className="size-4" aria-hidden="true" /> Tambah sertifikat
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
              crud.items.map((item) => (
                <tr key={item.id} className={rowClass}>
                  <td className={cell}>
                    <div className="flex items-center gap-6">
                      <Thumb src={item.imageUrl} />
                      <span className="font-semibold">{item.title}</span>
                    </div>
                  </td>
                  <td className={`${cell} text-zinc-500`}>{item.issuer}</td>
                  <td className={`${cell} text-zinc-500`}>{item.issuedAt?.slice(0, 4)}</td>
                  <td className={cell}>
                    <RowActions name={item.title} onEdit={() => crud.startEdit(item)} onDelete={() => crud.askDelete(item)} />
                  </td>
                </tr>
              ))
            )}
          </AdminTable>
        )}
      </div>

      <section ref={crud.formRef} className="mt-16 scroll-mt-6" aria-label="Formulir sertifikat">
        <FormHeading title="Formulir sertifikat" editingName={crud.isEditing ? form.values.title : null} />
        <form onSubmit={form.submit} className="mt-6">
          <div className="grid gap-x-10 gap-y-6 md:grid-cols-3">
            <TextField label="Nama sertifikat" placeholder="Masukkan judul" required {...form.bind("title")} />
            <TextField label="Organisasi penerbit" placeholder="Masukkan organisasi" required {...form.bind("issuer")} />
            <TextField label="Tanggal terbit" type="date" required {...form.bind("issuedAt")} />

            <ImageUpload
              label="Pratinjau sertifikat"
              caption="Unggah gambar sertifikat"
              value={form.values.imageUrl}
              onChange={(url) => form.set("imageUrl", url)}
              boxClassName="aspect-[4/3]"
              className="max-w-[16rem] md:row-span-2"
            />
            <TextField label="Tanggal kedaluwarsa (opsional)" type="date" {...form.bind("expiresAt")} />
            <TextField label="ID kredensial (opsional)" placeholder="Masukkan ID kredensial" {...form.bind("credentialId")} />
            <TextField label="URL kredensial" type="url" placeholder="https://" {...form.bind("credentialUrl")} />
            <TextField label="Deskripsi" placeholder="Masukkan deskripsi" {...form.bind("description")} />
          </div>

          <FormActions onCancel={crud.cancelEdit} saving={form.saving} status={form.status} />
        </form>
      </section>

      <ConfirmDialog
        open={crud.deleteTarget !== null}
        description={`Sertifikat "${crud.deleteTarget?.title}" akan dihapus. Tindakan ini tidak dapat dibatalkan.`}
        busy={crud.deleting}
        error={crud.deleteError}
        onConfirm={crud.confirmDelete}
        onCancel={crud.cancelDelete}
      />
    </>
  );
}
