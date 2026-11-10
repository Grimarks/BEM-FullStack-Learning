import { useFetch } from "../../hooks/useFetch.js";
import { adminApi } from "../lib/adminApi.js";
import { useForm } from "../hooks/useForm.js";
import { PageHeader, PageLoading, PageError, FormActions } from "../components/PageHeader.jsx";
import { TextField, TextArea } from "../components/Field.jsx";

function HeroForm({ initial }) {
  const form = useForm(initial, adminApi.saveHero);

  return (
    <form onSubmit={form.submit} className="mt-10">
      <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
        <TextField label="Nama tampilan" placeholder="Nama Anda" required {...form.bind("displayName")} />
        <TextField label="Label profesi" placeholder="FULLSTACK DEVELOPER" {...form.bind("roleLabel")} />
        <TextField label="Judul utama" placeholder="Bangun dan luncurkan." {...form.bind("headline")} />
        <TextField label="Teks utama hero" placeholder="Tulis teks utama hero" {...form.bind("heroText")} />
        <TextField label="Teks pendukung" placeholder="Tulis teks pendukung" {...form.bind("supportText")} />
        <TextField label="Teks hero lainnya" placeholder="Tulis teks hero tambahan" {...form.bind("extraText")} />
        <TextArea label="Deskripsi" placeholder="Tulis deskripsi hero..." rows={4} className="md:col-span-2" {...form.bind("description")} />
        <TextField label="Teks tombol CTA" placeholder="Jelajahi proyek" {...form.bind("ctaLabel")} />
        <TextField
          label="URL tujuan CTA"
          placeholder="https://example.com/projects atau #proyek"
          hint="Boleh link lengkap (https://...) atau bagian halaman (#proyek)."
          {...form.bind("ctaUrl")}
        />
      </div>

      <FormActions onCancel={form.reset} saving={form.saving} status={form.status} cancelDisabled={!form.dirty} />
    </form>
  );
}

export default function HeroPage() {
  const { status, data, error, reload } = useFetch(adminApi.getHero);

  return (
    <>
      <PageHeader title="Hero" description="Ubah teks dan tautan pada bagian hero." />
      {status === "error" ? (
        <PageError error={error} onRetry={reload} />
      ) : !data ? (
        <PageLoading />
      ) : (
        <HeroForm initial={data} />
      )}
    </>
  );
}
