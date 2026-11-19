import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useFetch } from "../../hooks/useFetch.js";
import { adminApi, isMockMode } from "../lib/adminApi.js";
import { handleLinkClick } from "../lib/router.js";
import { adminPages } from "../components/AdminLayout.jsx";
import { PageHeader, PageError } from "../components/PageHeader.jsx";
import AdminButton from "../components/AdminButton.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

const sections = adminPages.filter((p) => p.key);

export default function OverviewPage() {
  const { status, data: summary, error, reload } = useFetch(adminApi.getSummary);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function handleReset() {
    setResetting(true);
    await adminApi.resetMock();
    setResetting(false);
    setConfirmReset(false);
    reload();
  }

  return (
    <>
      <PageHeader title="Ringkasan" description="Kelola konten yang tampil di website portofolio." />

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((page) => (
          <li key={page.path}>
            <a
              href={page.path}
              onClick={(event) => handleLinkClick(event, page.path)}
              className="group block rounded-xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400"
            >
              <h2 className="text-xl font-semibold">{page.label}</h2>
              <p className="mt-2 text-zinc-500">{page.description}</p>
              <p className="mt-6 flex items-center justify-between text-sm font-semibold">
                Kelola bagian
                <ChevronRight className="size-5 text-zinc-500 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </p>
            </a>
          </li>
        ))}
      </ul>

      <section className="mt-16" aria-labelledby="konten-title">
        <h2 id="konten-title" className="text-xl font-semibold">
          Konten
        </h2>
        {status === "error" ? (
          <PageError error={error} onRetry={reload} />
        ) : (
          <div className="mt-4 overflow-x-auto border-t border-zinc-200">
            <table className="w-full min-w-[32rem] text-left text-[15px]">
              <thead className="text-sm text-zinc-500">
                <tr className="border-b border-zinc-200">
                  <th scope="col" className="px-6 py-5 font-medium">Bagian</th>
                  <th scope="col" className="px-6 py-5 font-medium">Jumlah</th>
                  <th scope="col" className="px-6 py-5 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((page) => (
                  <tr key={page.path} className="border-b border-zinc-200">
                    <td className="px-6 py-5">{page.label}</td>
                    <td className="px-6 py-5 text-zinc-500">
                      {/* ?? "…" = tampilkan titik-titik selama data belum datang */}
                      {summary?.[page.key] ?? "…"}
                    </td>
                    <td className="px-6 py-5">
                      <a
                        href={page.path}
                        onClick={(event) => handleLinkClick(event, page.path)}
                        className="font-semibold hover:underline"
                        aria-label={`Kelola ${page.label}`}
                      >
                        Kelola
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isMockMode && (
        <section className="mt-16 rounded-xl border border-dashed border-zinc-300 p-6">
          <h2 className="font-semibold">Data contoh</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Backend belum tersambung, jadi perubahan disimpan di browser ini (localStorage). Kembalikan ke isi awal
            kalau datanya sudah berantakan.
          </p>
          <AdminButton variant="secondary" onClick={() => setConfirmReset(true)} className="mt-4">
            Reset data contoh
          </AdminButton>
        </section>
      )}

      <ConfirmDialog
        open={confirmReset}
        title="Reset data contoh?"
        description="Semua perubahan yang kamu buat di admin akan hilang dan kembali ke isi awal."
        confirmLabel="Reset"
        busy={resetting}
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </>
  );
}
