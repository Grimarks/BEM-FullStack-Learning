import { useEffect } from "react";
import { usePath } from "./lib/router.js";
import AdminLayout, { adminPages } from "./components/AdminLayout.jsx";
import AdminButton from "./components/AdminButton.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import HeroPage from "./pages/HeroPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import JourneyPage from "./pages/JourneyPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import CertificatesPage from "./pages/CertificatesPage.jsx";
import FooterPage from "./pages/FooterPage.jsx";

const routes = {
  "/admin": OverviewPage,
  "/admin/hero": HeroPage,
  "/admin/profil": ProfilePage,
  "/admin/perjalanan": JourneyPage,
  "/admin/proyek": ProjectsPage,
  "/admin/sertifikasi": CertificatesPage,
  "/admin/footer": FooterPage,
};

function NotFound() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-zinc-500">Alamat ini tidak ada di menu admin.</p>
      <AdminButton to="/admin" className="mt-6">
        Kembali ke Ringkasan
      </AdminButton>
    </div>
  );
}

export default function AdminApp() {
  const path = usePath().replace(/\/+$/, "") || "/admin";
  const Page = routes[path] ?? NotFound;
  const title = adminPages.find((p) => p.path === path)?.label ?? "Tidak ditemukan";

  useEffect(() => {
    document.title = `${title} · CMS Portofolio`;
  }, [title]);

  return (
    <AdminLayout currentPath={path} title={title}>
      <Page key={path} />
    </AdminLayout>
  );
}
