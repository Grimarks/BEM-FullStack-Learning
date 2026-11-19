import { useFetch } from "../../hooks/useFetch.js";
import { adminApi } from "../lib/adminApi.js";
import { useForm } from "../hooks/useForm.js";
import { PageHeader, PageLoading, PageError, FormActions } from "../components/PageHeader.jsx";
import { TextField, TextArea } from "../components/Field.jsx";
import ImageUpload from "../components/ImageUpload.jsx";
import TechPicker from "../components/TechPicker.jsx";

function ProfileForm({ initial }) {
  const form = useForm(initial, adminApi.saveProfile);

  return (
    <form onSubmit={form.submit} className="mt-10">
      <div className="grid gap-x-10 gap-y-6 lg:grid-cols-[13.5rem_1fr]">
        <ImageUpload
          label="Unggah foto"
          purpose="profile"
          value={form.values.photoUrl}
          onChange={(url) => form.set("photoUrl", url)}
          className="max-w-[13.5rem]"
        />
        <div className="grid content-start gap-x-10 gap-y-5 sm:grid-cols-2">
          <TextField label="Nama lengkap" placeholder="Nama lengkap Anda" required {...form.bind("fullName")} />
          <TextField label="Jabatan profesional" placeholder="Pengembang Fullstack" {...form.bind("role")} />
          <TextField label="Lokasi" placeholder="Kota, negara" {...form.bind("location")} />
          <TextField label="Email" type="email" placeholder="you@example.com" {...form.bind("email")} />
        </div>
      </div>

      <div className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
        <TextArea label="Biografi" placeholder="Tulis biografi singkat..." rows={4} {...form.bind("bio")} />
        <TextArea label="Deskripsi tentang saya" placeholder="Tulis deskripsi tentang Anda..." rows={4} {...form.bind("about")} />
        <div className="md:col-span-2">
          <TechPicker
            value={form.values.tech ?? []}
            onChange={(tech) => form.set("tech", tech)}
            hint="Pilih dari katalog atau buat teknologi baru dengan ikon PNG/JPG/WebP · atur urutan dengan tombol panah"
          />
        </div>
      </div>

      <FormActions onCancel={form.reset} saving={form.saving} status={form.status} cancelDisabled={!form.dirty} />
    </form>
  );
}

export default function ProfilePage() {
  const { status, data, error, reload } = useFetch(adminApi.getProfile);

  return (
    <>
      <PageHeader title="Profil" description="Kelola profil, foto, dan ikon teknologi." />
      {status === "error" ? (
        <PageError error={error} onRetry={reload} />
      ) : !data ? (
        <PageLoading />
      ) : (
        <ProfileForm initial={data} />
      )}
    </>
  );
}
