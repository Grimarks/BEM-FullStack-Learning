# Koleksi API Portfolio

Folder ini memakai format OpenCollection YAML yang dibuat oleh Bruno (`opencollection.yml` dan request `.yml`). Buka folder `BEM-FULLSTACK` sebagai collection di Bruno, lalu pilih environment **Lokal**.

Isi `adminPassword` dengan password admin dari `BackEnd/.env`. Jalankan **03 Login** sebelum request admin. Request tambah menyimpan ID hasil response sebagai variabel runtime untuk request detail, ubah, dan hapus. Ikuti urutan `seq` yang tampil di Bruno.

Untuk pengujian ganti password, isi `newPassword` dengan nilai berbeda yang panjangnya minimal 12 karakter. Request **48–51** mengganti lalu mengembalikan password, dan **52 Logout** mengakhiri sesi.

Request tambah/ubah ikon, tambah/ubah proyek, dan ubah profil sudah memakai `multipart-form`. Field teks mengikuti tag `form` pada DTO backend, sedangkan field `file` menunjuk ke `assets/contoh-upload.png`. Bruno mengirimkan `Content-Type` beserta boundary secara otomatis. Ganti file contoh melalui tab Body jika ingin mengunggah gambar sendiri. Backend menyimpan gambar dan mengisi kolom URL-nya dari hasil upload; URL tidak perlu dikirim pada request tersebut.
