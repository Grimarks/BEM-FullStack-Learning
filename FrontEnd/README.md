# Frontend Portfolio (React + Vite)

Situs portfolio pribadi beserta halaman admin (CMS) untuk mengubah isinya. Dibangun dengan React 19, Vite 8, dan Tailwind CSS v4, dan mengambil data dari backend Go di folder [`../BackEnd`](../BackEnd/README.md).

**Demo:** https://frontendbem.vercel.app (admin: https://frontendbem.vercel.app/admin)

> Versi demo di Vercel berjalan dalam **mode data contoh** (`VITE_USE_MOCK=true`) karena backend belum di-deploy. Admin bisa dibuka tanpa login, dan perubahan hanya tersimpan di browser masing-masing pengunjung.

## Menjalankan

### Yang dibutuhkan

- Node.js 20.19+ atau 22.12+
- Backend Go yang sedang berjalan di `http://localhost:8080`. Ikuti [`BackEnd/README.md`](../BackEnd/README.md).
  Tanpa backend, pakai [mode data contoh](#mode-data-contoh-tanpa-backend).

### Langkah menjalankan

Jalankan backend dan frontend bersamaan, masing-masing di terminal sendiri:

```bash
# Terminal 1: backend
cd BackEnd
go run .            # http://localhost:8080  (Swagger: /swagger)

# Terminal 2: frontend
cd FrontEnd
npm install         # cukup sekali
npm run dev         # http://localhost:5173
```

Saat development, request ke `/api` dan `/uploads` diteruskan ke `localhost:8080` oleh proxy di `vite.config.js`. Karena itu tidak perlu mengatur URL backend, dan cookie login tetap jalan karena browser hanya melihat satu alamat.

### Mode data contoh (tanpa backend)

Buat file `FrontEnd/.env.local`:

```env
VITE_USE_MOCK=true
```

Lalu restart `npm run dev`. Situs publik dan admin memakai data dari `src/data/mock.js`. Perubahan di admin disimpan di browser itu saja, dan admin bisa dibuka tanpa login.

## Script

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server development dengan hot reload |
| `npm run build` | Build production ke folder `dist/` |
| `npm run preview` | Menjalankan hasil build secara lokal (proxy `/api` tetap aktif) |
| `npm run lint` | Cek kode dengan ESLint |

## Environment variable

Semua variabel `VITE_*` **ditanam ke dalam JavaScript saat build**, jadi:
- jangan pernah menaruh rahasia (password, API key) di sini
- setelah mengubahnya, `npm run dev` harus di-restart, atau di Vercel harus di-**Redeploy**

| Variabel | Default | Fungsi |
|---|---|---|
| `VITE_USE_MOCK` | *(kosong)* | `true` = pakai data contoh di browser, bukan backend |
| `VITE_API_URL` | `/api` | Alamat API. Isi hanya kalau backend ada di domain lain, misalnya `https://api.domainmu.com/api` |

## Halaman admin

Buka http://localhost:5173/admin, lalu login dengan `ADMIN_USERNAME` / `ADMIN_PASSWORD` dari `BackEnd/.env`.

| Halaman | Path | Yang diatur |
|---|---|---|
| Ringkasan | `/admin` | Jumlah data tiap bagian |
| Hero | `/admin/hero` | Nama tampilan, label profesi, judul, teks hero, tombol CTA |
| Profil | `/admin/profil` | Foto, nama, lokasi, email, biografi, teknologi |
| Perjalanan | `/admin/perjalanan` | Riwayat pendidikan dan pengalaman |
| Proyek | `/admin/proyek` | Proyek, gambar, tautan, teknologi |
| Sertifikasi | `/admin/sertifikasi` | Sertifikat dan kredensial |
| Footer & Sosial | `/admin/footer` | Teks footer dan tautan media sosial |

## Sumber data tiap section

Semua section publik membaca `GET /api/public/portfolio` lewat `src/lib/api.js`. Bagian yang belum punya kolom di backend tetap diambil dari `src/data/profile.js`.

| Section | Dari backend | Tetap dari `profile.js` | Kalau backend mati |
|---|---|---|---|
| Hero | nama, label profesi, judul, teks hero, deskripsi, CTA | teks pojok, link CV | tampil teks `profile.js` |
| About | nama, lokasi, foto, email, biografi, tentang, teknologi | motto, highlights, keahlian, kontak web/WA | tampil teks `profile.js` |
| Journey | semua | – | pesan error + tombol coba lagi |
| Projects | semua | link "Lihat semua karya" | pesan error + tombol coba lagi |
| Certificates | semua (gambar memakai placeholder) | – | pesan error + tombol coba lagi |
| Contact | teks footer, hak cipta, tautan sosial, nama, peran, lokasi | tombol WhatsApp | tampil teks `profile.js` |

Hero, About, dan Contact sengaja memakai **fallback**: teks dari `profile.js` tampil dulu, lalu diganti saat data backend datang. Dengan begitu, layar pertama tidak pernah kosong atau error.

## Alur data

```
Admin (pages/*.jsx)                     Situs publik (sections/*.jsx)
        │                                          │
        ▼                                          ▼
admin/lib/adminApi.js                       lib/api.js
        │                                          │
        └──────────► lib/mappers.js ◄──────────────┘
                     menerjemahkan field backend ↔ frontend
                     (teks_utama_hero ↔ heroText, lokasi ↔ location, ...)
                              │
                              ▼
                   Backend Go  /api/...  →  MySQL
```

**Aturan:** komponen tidak pernah memanggil `fetch` langsung. Semua lewat `api.js` / `adminApi.js`, jadi kalau backend berubah, cukup `mappers.js` yang diubah.

## Struktur folder

```
FrontEnd/
├── public/images/          gambar statis (foto, dekorasi, placeholder)
├── vercel.json             rewrite supaya /admin tidak 404 di Vercel
├── vite.config.js          plugin React + Tailwind, proxy /api → :8080
└── src/
    ├── main.jsx            entry point: /admin → AdminApp, selain itu → App
    ├── App.jsx             urutan section situs publik
    ├── index.css           design token Tailwind (@theme): warna, font, ukuran
    ├── data/
    │   ├── profile.js      konten statis (fallback + bagian yang belum ada di backend)
    │   ├── mock.js         data contoh untuk mode mock
    │   └── mockDb.js       penyimpanan data contoh di browser
    ├── lib/
    │   ├── api.js          SATU-SATUNYA tempat situs publik bicara ke backend
    │   ├── mappers.js      penerjemah field backend ↔ frontend
    │   └── cx.js           penggabung className
    ├── hooks/
    │   ├── useFetch.js     state loading / error / success
    │   ├── useCarousel.js  logika tombol ← → carousel
    │   └── useActiveSection.js  menandai menu navbar yang aktif
    ├── components/
    │   ├── layout/Navbar.jsx
    │   ├── sections/       Hero, About, Journey, Projects, Certificates, Contact
    │   └── ui/             komponen kecil: Button, Chip, MediaCard, DetailModal, ...
    └── admin/
        ├── AdminApp.jsx    penjaga login + routing admin
        ├── pages/          satu file per halaman admin
        ├── components/     layout, form field, upload gambar, pemilih teknologi
        ├── hooks/          useForm, useCrud
        └── lib/            adminApi.js, router.js
```

## Mengubah isi

| Yang ingin diubah | Di mana |
|---|---|
| Teks Hero, profil, proyek, sertifikat, footer | Halaman admin (`/admin`) |
| Motto, highlights, keahlian, nomor WhatsApp, link CV | `src/data/profile.js` |
| Foto profil cadangan | `public/images/` + field `photo` di `profile.js` |
| File CV | taruh di `public/cv.pdf` *(belum ada)* |
| Warna, font, ukuran huruf | blok `@theme` di `src/index.css` |
| Data yang tampil di mode mock / demo Vercel | `src/data/mock.js` |

## Deploy ke Vercel

1. Import repository ke Vercel, lalu set **Root Directory** ke `FrontEnd`.
2. `vercel.json` sudah berisi rewrite ke `index.html`. Tanpa file ini, membuka `/admin` langsung akan 404, karena halaman admin dibuat oleh React dan tidak berupa file.
3. Pilih salah satu:
   - **Tanpa backend (seperti demo sekarang):** set `VITE_USE_MOCK=true` di *Settings → Environment Variables*, lalu **Redeploy**.
   - **Dengan backend online** (Railway, Render, VPS, dan sejenisnya): tambahkan rewrite `/api/*` dan `/uploads/*` ke alamat backend di `vercel.json`, **sebelum** rewrite `index.html`:
     ```json
     {
       "rewrites": [
         { "source": "/api/:path*", "destination": "https://alamat-backend.com/api/:path*" },
         { "source": "/uploads/:path*", "destination": "https://alamat-backend.com/uploads/:path*" },
         { "source": "/(.*)", "destination": "/index.html" }
       ]
     }
     ```
     Dengan cara ini browser tetap melihat satu domain, jadi cookie login berfungsi tanpa perlu mengubah backend.

## Catatan

- Backend belum punya kolom untuk gambar sertifikat, keahlian, dan tautan tambahan proyek, jadi bagian itu memakai placeholder atau `profile.js`.
- Saat halaman dibuka, `GET /api/public/portfolio` dipanggil beberapa kali (sekali per section). Hasilnya sama, jadi ini masih bisa dioptimalkan dengan menyimpan hasil panggilan pertama di `api.js`.
- `npm run lint` menampilkan beberapa error `react-hooks/refs` dan `react-hooks/set-state-in-effect` dari kode bawaan (`useCarousel`, `useFetch`). Aplikasi tetap berjalan normal.
