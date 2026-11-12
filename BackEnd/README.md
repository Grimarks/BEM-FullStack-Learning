# Backend Portfolio (Fiber + GORM)

Backend belajar untuk portfolio pribadi. Memakai Fiber v2, GORM, dan MySQL. Buat database bernama `bem_portfolio` di MySQL sebelum menjalankan server.

## Menjalankan backend

### Yang dibutuhkan

- Go 1.23 atau lebih baru
- MySQL yang sedang berjalan

### Langkah menjalankan

1. Buat database MySQL:

   ```sql
   CREATE DATABASE bem_portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Dari folder `BackEnd`, salin `.env.example` menjadi `.env`:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Buka `.env`, sesuaikan `DATABASE_DSN` dengan username, password, host, dan nama database MySQL. Isi `ADMIN_PASSWORD` dengan password awal minimal 12 karakter. Nilai ini hanya dipakai saat membuat akun admin pertama kali.

4. Jalankan backend:

   ```powershell
   go mod tidy
   go run .
   ```

5. Server aktif di `http://localhost:8080`. Saat pertama berjalan, GORM membuat tabel lalu mengisi data contoh. Buka `http://localhost:8080/swagger` untuk mencoba API.

Contoh DSN lokal di `.env`:

```env
DATABASE_DSN=root:password@tcp(127.0.0.1:3306)/bem_portfolio?charset=utf8mb4&parseTime=True&loc=Local
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ganti-dengan-password-minimal-12-karakter
```

Login Swagger menggunakan `ADMIN_USERNAME` dan `ADMIN_PASSWORD` dari `.env`. Seed hanya mengisi ID yang belum ada dan tidak menimpa data yang sudah tersimpan. Jika ingin mengulang kondisi database kosong untuk latihan, hapus database `bem_portfolio`, buat lagi, lalu jalankan backend.

## Keamanan yang diterapkan

- Password admin di-hash memakai bcrypt. Tidak ada endpoint pendaftaran.
- Satu sesi aktif disimpan di baris auth ID 1. Browser menerima token acak di cookie HttpOnly; DB menyimpan SHA-256 token, bukan token mentah.
- Cookie SameSite=Strict dan Secure saat APP_ENV=production. Login baru mengganti sesi sebelumnya.
- Semua route admin memakai middleware sesi. CORS hanya menerima origin FRONTEND_ORIGIN.
- Upload hanya menerima JPEG/PNG/WebP maksimal MAX_UPLOAD_MB, dengan nama acak.
- Input JSON memakai DTO, validasi enum/URL/tanggal, dan query pagination dibatasi.

Setiap model dan DTO ada di file terpisah di `models/` (contoh `models/proyek.go`). Nama file, tipe model, dan field model menggunakan bahasa Indonesia agar dekat dengan nama tabel. Handler tetap menangani parsing HTTP dan validasi.

## Route utama

- Publik: `GET /api/public/portfolio`
- Auth: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `PUT /api/auth/password`
- Data tunggal: `GET/PUT /api/admin/content`, `GET/PUT /api/admin/profile`
- CRUD: `/api/admin/experiences`, `/projects`, `/certificates`, `/social-links`, `/icons`, `/technologies`
- Relasi teknologi: `/api/admin/projects/:projectId/technologies` dan `/api/admin/profile/technologies`
- Upload: `POST /api/admin/uploads`
- Dashboard: `GET /api/admin/dashboard`

Setiap tabel daftar memiliki GET/POST dan GET/PUT/DELETE pada `/:id`, kecuali operasi relasi yang dijelaskan di atas. Data satu baris tidak menerima ID.

## Contoh login dan cookie

Kirim `POST /api/auth/login` dengan JSON `{ "username": "admin", "password": "..." }`. Browser harus memakai credentials saat fetch lintas origin, misalnya `credentials: "include"`. Logout dan ganti password juga membutuhkan cookie.

## Swagger UI

Jalankan backend, lalu buka `http://localhost:8080/swagger`. UI membaca spesifikasi dari `docs/openapi.yaml` dan bisa mengirim request langsung ke server. Gunakan `POST /api/auth/login` terlebih dahulu untuk membuat cookie sesi, kemudian coba endpoint admin. Aset Swagger UI dimuat dari CDN sehingga browser perlu akses internet; file spesifikasi tetap berada di proyek.

## Catatan

Upload lokal cocok untuk pengembangan. Jangan menghapus database saat ingin menjaga konten; seed hanya mengisi record yang belum ada. Tabel teknologi/ikon yang sedang direferensikan tidak dapat dihapus sampai relasinya dilepas.
