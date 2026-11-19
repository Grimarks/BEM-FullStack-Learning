import { useEffect, useState } from "react";
import { usePath } from "./lib/router.js";
import AdminLayout, { adminPages } from "./components/AdminLayout.jsx";
import AdminButton from "./components/AdminButton.jsx";
import { Notice } from "./components/PageHeader.jsx";
import { adminApi, UNAUTHORIZED_EVENT } from "./lib/adminApi.js";
import LoginPage from "./pages/LoginPage.jsx";
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

function useSession() {
    const [session, setSession] = useState({ status: "checking" });

    function check() {
        const controller = new AbortController();
        setSession({ status: "checking" });
        adminApi.auth
            .me({ signal: controller.signal })
            .then((me) => setSession({ status: "in", username: me.username }))
            .catch((error) => {
                if (error.name === "AbortError") return;
                setSession(error.status === 401 ? { status: "out" } : { status: "error", error });
            });
        return controller;
    }

    useEffect(() => {
        const controller = check();
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const onUnauthorized = () => setSession({ status: "out", expired: true });
        window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
        return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    }, []);

    return {
        ...session,
        retry: check,
        loggedIn: (username) => setSession({ status: "in", username }),
        logout: async () => {
            await adminApi.auth.logout().catch(() => {});
            setSession({ status: "out" });
        },
    };
}

export default function AdminApp() {
    const session = useSession();
    const path = usePath().replace(/\/+$/, "") || "/admin";
    const Page = routes[path] ?? NotFound;
    const title = adminPages.find((p) => p.path === path)?.label ?? "Tidak ditemukan";

    useEffect(() => {
        document.title = `${title} · CMS Portofolio`;
    }, [title]);

    if (session.status === "checking") return null;
    if (session.status === "out") return <LoginPage onLogin={session.loggedIn} expired={session.expired} />;
    if (session.status === "error") {
        return (
            <main className="mx-auto max-w-lg px-4 py-24 font-[system-ui]">
                <h1 className="text-2xl font-semibold">Backend tidak bisa dihubungi</h1>
                <Notice tone="error" className="mt-4">{session.error.message}</Notice>
                <p className="mt-4 text-sm text-zinc-500">
                    Pastikan backend jalan di http://localhost:8080 (cd BackEnd → go run .), lalu coba lagi.
                    Atau pakai data contoh: buat file .env.local berisi VITE_USE_MOCK=true.
                </p>
                <AdminButton onClick={session.retry} className="mt-6">
                    Coba lagi
                </AdminButton>
            </main>
        );
    }

    return (
        <AdminLayout currentPath={path} title={title} username={session.username} onLogout={session.logout}>
            <Page key={path} />
        </AdminLayout>
    );
}
