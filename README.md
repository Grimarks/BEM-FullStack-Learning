# BEM FullStack Learning

Repository belajar fullstack: **situs portfolio pribadi + halaman admin (CMS)** untuk mengubah isinya tanpa menyentuh kode.

| Bagian | Teknologi | Dokumentasi |
|---|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4 | [FrontEnd/README.md](FrontEnd/README.md) |
| Backend | Go, Fiber v2, GORM, MySQL | [BackEnd/README.md](BackEnd/README.md) |

**Demo frontend:** https://frontendbem.vercel.app · admin: https://frontendbem.vercel.app/admin
*(berjalan dengan data contoh karena backend belum di-deploy)*

## Struktur

```text
BEM-FullStack-Learning/
├── FrontEnd/           # Situs portfolio + halaman admin (React + Vite)
│   ├── src/
│   ├── public/
│   └── vercel.json
└── BackEnd/            # REST API (Fiber + GORM + MySQL)
    ├── handlers/
    ├── models/
    ├── docs/           # OpenAPI / Swagger
    └── .env.example
```

## Cara kerja

```
 Browser
   │
   ├── /            situs publik  ──┐
   └── /admin       halaman admin ──┤
                                    ▼
              FrontEnd (Vite, :5173)
                     │  /api, /uploads  (proxy)
                     ▼
              BackEnd (Fiber, :8080)
                     │  GORM
                     ▼
              MySQL (database bem_portfolio)
```

- Admin login dengan cookie sesi, lalu mengubah data lewat `/api/admin/...`.
- Situs publik membaca semua data sekaligus dari `GET /api/public/portfolio`.
- Frontend menerjemahkan nama field backend (`teks_utama_hero`, `lokasi`, ...) ke nama frontend (`heroText`, `location`, ...) di `FrontEnd/src/lib/mappers.js`.

## Menjalankan secara lokal

### Yang dibutuhkan

- Go 1.23+
- MySQL
- Node.js 20.19+ atau 22.12+

### 1. Siapkan database

```sql
CREATE DATABASE bem_portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Siapkan backend

```bash
cd BackEnd
cp .env.example .env
```

Buka `BackEnd/.env`, lalu isi minimal:

```env
DATABASE_DSN=root:PASSWORD_MYSQL@tcp(127.0.0.1:3306)/bem_portfolio?charset=utf8mb4&parseTime=True&loc=Local
ADMIN_PASSWORD=minimal-12-karakter
```

Format `DATABASE_DSN`: `user:password@tcp(host:port)/nama_database?setting`. Penjelasan lengkapnya ada di [BackEnd/README.md](BackEnd/README.md).

### 3. Jalankan keduanya (dua terminal)

```bash
# Terminal 1
cd BackEnd
go run .          # http://localhost:8080  ·  Swagger: http://localhost:8080/swagger

# Terminal 2
cd FrontEnd
npm install       # cukup sekali
npm run dev       # http://localhost:5173  ·  Admin: http://localhost:5173/admin
```

Login admin memakai `ADMIN_USERNAME` dan `ADMIN_PASSWORD` dari `BackEnd/.env`.

Belum punya MySQL? Frontend bisa dijalankan sendiri dengan data contoh: buat `FrontEnd/.env.local` berisi `VITE_USE_MOCK=true`. Detailnya ada di [FrontEnd/README.md](FrontEnd/README.md#mode-data-contoh-tanpa-backend).

## Deployment

| Bagian | Status |
|---|---|
| Frontend | Vercel, Root Directory `FrontEnd`, mode data contoh (`VITE_USE_MOCK=true`) |
| Backend | Belum di-deploy (hanya lokal) |

Cara menyambungkan frontend Vercel ke backend yang sudah online ada di [FrontEnd/README.md → Deploy ke Vercel](FrontEnd/README.md#deploy-ke-vercel).

## Troubleshooting

| Gejala | Penyebab | Solusi |
|---|---|---|
| `go run .` → `DATABASE_DSN wajib diisi` | `BackEnd/.env` belum dibuat | `cp .env.example .env`, lalu isi |
| `go run .` → `Access denied for user` | Username/password di `DATABASE_DSN` salah | Cek dengan `mysql -u root -p` |
| `go run .` → `Unknown database` | Database belum dibuat | Jalankan langkah 1 |
| Perubahan di admin tidak tampil di situs | Bagian itu masih membaca `profile.js` | Lihat tabel *Sumber data tiap section* di [FrontEnd/README.md](FrontEnd/README.md#sumber-data-tiap-section) |
| `/admin` 404 di Vercel | `vercel.json` tidak ada | Pastikan `FrontEnd/vercel.json` ter-push |
| Env var di Vercel tidak berpengaruh | Variabel `VITE_*` ditanam saat build | **Redeploy** setelah mengubahnya |

## Kredit

Dibuat sebagai bahan belajar dari *Fullstack Development Workshop 2026*.
