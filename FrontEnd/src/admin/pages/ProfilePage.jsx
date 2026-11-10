import { useFetch } from "../../hooks/useFetch.js";
import { adminApi } from "../lib/adminApi.js";
import { useForm } from "../hooks/useForm.js";
import { PageHeader, PageLoading, PageError, FormActions } from "../components/PageHeader.jsx";
import { TextField, TextArea } from "../components/Field.jsx";
import ImageUpload from "../components/ImageUpload.jsx";
import TechPicker from "../components/TechPicker.jsx";
function fromApi({ skills, ...profile }) {
  return { ...profile, skillsText: (skills ?? []).join(", ") };
}

function toApi({ skillsText, ...values }) {
  const skills = skillsText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return { ...values, skills };
}

async function saveProfile(values) {
  const saved = await adminApi.saveProfile(toApi(values));
  return fromApi(saved);
}

function ProfileForm({ initial }) {
  const form = useForm(fromApi(initial), saveProfile);

  return (
    <form onSubmit={form.submit} className="mt-10">
      <div className="grid gap-x-10 gap-y-6 lg:grid-cols-[13.5rem_1fr]">
        <ImageUpload
          label="Unggah foto"
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
        <TextField
          label="Keahlian"
          placeholder="Pisahkan keahlian dengan koma"
          hint="Contoh: Pemikiran Produk, Desain REST API, Manajemen Database"
          {...form.bind("skillsText")}
        />
        <TechPicker
          value={form.values.tech ?? []}
          onChange={(tech) => form.set("tech", tech)}
          hint="Pilih ikon dari pustaka atau unggah SVG/PNG · pratinjau dan atur urutan"
        />
      </div>

      <FormActions onCancel={form.reset} saving={form.saving} status={form.status} cancelDisabled={!form.dirty} />
    </form>
  );
}

export default function ProfilePage() {
  const { status, data, error, reload } = useFetch(adminApi.getProfile);

  return (
    <>
      <PageHeader title="Profil" description="Kelola profil, keahlian, foto, dan ikon teknologi." />
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
