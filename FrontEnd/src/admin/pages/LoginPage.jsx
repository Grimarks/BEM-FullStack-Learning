import { useState } from "react";
import { adminApi } from "../lib/adminApi.js";
import { TextField } from "../components/Field.jsx";
import { Notice } from "../components/PageHeader.jsx";
import AdminButton from "../components/AdminButton.jsx";

export default function LoginPage({ onLogin, expired = false }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await adminApi.auth.login(username.trim(), password);
      onLogin(result.username ?? username.trim());
    } catch (err) {
      setError(err.message);
      setPassword("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-svh place-items-center bg-zinc-50 px-4 font-[system-ui] text-zinc-900">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-xl font-semibold">CMS Portofolio</p>
        <p className="mt-1 text-xs tracking-wide text-zinc-500 uppercase">Admin</p>
        <h1 className="mt-8 text-2xl font-semibold">Masuk</h1>
        <p className="mt-1 text-sm text-zinc-500">Gunakan akun admin dari backend (ADMIN_USERNAME di file .env).</p>

        {expired && !error && (
          <Notice tone="error" className="mt-6">
            Sesi berakhir. Silakan masuk lagi.
          </Notice>
        )}
        <div role="alert">{error && <Notice tone="error" className="mt-6">{error}</Notice>}</div>

        <div className="mt-6 space-y-5">
          <TextField
            label="Nama pengguna"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Kata sandi"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <AdminButton type="submit" busy={busy} className="mt-8 w-full">
          Masuk
        </AdminButton>
        <a href="/" className="mt-6 block text-center text-sm text-zinc-500 hover:text-zinc-900">
          Kembali ke situs
        </a>
      </form>
    </main>
  );
}
