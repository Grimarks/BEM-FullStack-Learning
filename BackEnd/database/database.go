package database

import (
	"bem-portfolio/backend/config"
	"bem-portfolio/backend/models"
	"fmt"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func Open(cfg config.Config) (*gorm.DB, error) {
	db, err := gorm.Open(mysql.Open(cfg.DatabaseDSN), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("buka database: %w", err)
	}
	if err := db.AutoMigrate(
		&models.Autentikasi{}, &models.KontenWebsite{}, &models.Profil{}, &models.Ikon{},
		&models.MediaSosial{}, &models.Perjalanan{}, &models.Teknologi{}, &models.Proyek{},
		&models.Sertifikasi{}, &models.TeknologiProyek{}, &models.TeknologiProfil{},
	); err != nil {
		return nil, fmt.Errorf("migration: %w", err)
	}
	if err := seed(db, cfg); err != nil {
		return nil, err
	}
	return db, nil
}

func seed(db *gorm.DB, cfg config.Config) error {
	var auth models.Autentikasi
	err := db.First(&auth, 1).Error
	if err == gorm.ErrRecordNotFound {
		if len(cfg.AdminPassword) < 12 {
			return fmt.Errorf("ADMIN_PASSWORD wajib diisi minimal 12 karakter saat seed admin pertama")
		}
		hash, err := bcrypt.GenerateFromPassword([]byte(cfg.AdminPassword), bcrypt.DefaultCost)
		if err != nil {
			return fmt.Errorf("hash password admin: %w", err)
		}
		seedAuth := models.Autentikasi{IDAutentikasi: 1, NamaPengguna: cfg.AdminUsername, HashKataSandi: string(hash)}
		if err := db.Create(&seedAuth).Error; err != nil {
			return fmt.Errorf("seed admin: %w", err)
		}
	} else if err != nil {
		return fmt.Errorf("baca admin: %w", err)
	}

	var content models.KontenWebsite
	if err := db.First(&content, 1).Error; err == gorm.ErrRecordNotFound {
		content = models.KontenWebsite{
			IDKonten: 1, NamaTampilan: "Nama Anda", LabelProfesi: "PORTFOLIO",
			JudulUtama: "Halo, saya Nama Anda", TeksUtamaHero: "Saya seorang web developer",
			TeksPendukung: "Saya senang membangun aplikasi yang bermanfaat.",
			Deskripsi:     "Selamat datang di portfolio pribadi saya.", TeksTombolCTA: "Hubungi saya",
			URLTujuanCTA: "mailto:halo@example.com", DeskripsiFooter: "Terima kasih sudah berkunjung.",
			TeksHakCipta: "Hak cipta Nama Anda", TeksTambahanFooter: "Dibuat untuk belajar.",
		}
		if err := db.Create(&content).Error; err != nil {
			return fmt.Errorf("seed website content: %w", err)
		}
	} else if err != nil {
		return fmt.Errorf("baca website content: %w", err)
	}

	var profile models.Profil
	if err := db.First(&profile, 1).Error; err == gorm.ErrRecordNotFound {
		profile = models.Profil{
			IDProfil: 1, NamaLengkap: "Nama Anda", JabatanProfesional: "Web Developer",
			Lokasi: "Indonesia", Email: "halo@example.com", Biografi: "Saya sedang belajar pengembangan web.",
			DeskripsiTentangSaya: "Saya tertarik membangun aplikasi web dan terus belajar teknologi baru.",
		}
		if err := db.Create(&profile).Error; err != nil {
			return fmt.Errorf("seed profil: %w", err)
		}
	} else if err != nil {
		return fmt.Errorf("baca profil: %w", err)
	}

	ikonContoh := []models.Ikon{
		{IDIkon: 1, NamaIkon: "GitHub", URLIkon: "https://cdn.simpleicons.org/github", Kategori: "media_sosial"},
		{IDIkon: 2, NamaIkon: "Go", URLIkon: "https://cdn.simpleicons.org/go", Kategori: "teknologi"},
		{IDIkon: 3, NamaIkon: "React", URLIkon: "https://cdn.simpleicons.org/react", Kategori: "teknologi"},
	}
	for _, ikon := range ikonContoh {
		var data models.Ikon
		if err := db.First(&data, ikon.IDIkon).Error; err == gorm.ErrRecordNotFound {
			if err := db.Create(&ikon).Error; err != nil {
				return fmt.Errorf("seed ikon: %w", err)
			}
		} else if err != nil {
			return fmt.Errorf("baca ikon: %w", err)
		}
	}

	teknologiContoh := []models.Teknologi{
		{IDTeknologi: 1, NamaTeknologi: "Go", IDIkon: uintPointer(2)},
		{IDTeknologi: 2, NamaTeknologi: "React", IDIkon: uintPointer(3)},
	}
	for _, teknologi := range teknologiContoh {
		var data models.Teknologi
		if err := db.First(&data, teknologi.IDTeknologi).Error; err == gorm.ErrRecordNotFound {
			if err := db.Create(&teknologi).Error; err != nil {
				return fmt.Errorf("seed teknologi: %w", err)
			}
		} else if err != nil {
			return fmt.Errorf("baca teknologi: %w", err)
		}
	}

	perjalananContoh := []models.Perjalanan{
		{IDPerjalanan: 1, Institusi: "Universitas Contoh", Kategori: "pendidikan", TanggalMulai: time.Date(2022, 9, 1, 0, 0, 0, 0, time.UTC), InformasiTambahan: "Teknik Informatika", Deskripsi: "Belajar dasar pengembangan perangkat lunak.", UrutanTampil: 1},
		{IDPerjalanan: 2, Institusi: "BEM Fakultas", Kategori: "pekerjaan", TanggalMulai: time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC), InformasiTambahan: "Staf bidang teknologi", Deskripsi: "Berkolaborasi membuat program kerja digital.", UrutanTampil: 2},
	}
	for _, item := range perjalananContoh {
		var data models.Perjalanan
		if err := db.First(&data, item.IDPerjalanan).Error; err == gorm.ErrRecordNotFound {
			if err := db.Create(&item).Error; err != nil {
				return fmt.Errorf("seed perjalanan: %w", err)
			}
		} else if err != nil {
			return fmt.Errorf("baca perjalanan: %w", err)
		}
	}

	proyekContoh := []models.Proyek{
		{IDProyek: 1, Judul: "Portfolio Pribadi", Kategori: "Website", Deskripsi: "Website untuk menampilkan profil dan proyek.", Tanggal: datePointer(2025, 3, 1), URLDemo: "https://example.com", URLGitHub: "https://github.com/example/portfolio", Status: "finished", Prioritas: 1},
		{IDProyek: 2, Judul: "API Portfolio", Kategori: "Website", Deskripsi: "REST API sederhana menggunakan Go, Fiber, GORM, dan MySQL.", Tanggal: datePointer(2025, 5, 1), URLGitHub: "https://github.com/example/portfolio-api", Status: "on-going", Prioritas: 2},
	}
	for _, item := range proyekContoh {
		var data models.Proyek
		if err := db.First(&data, item.IDProyek).Error; err == gorm.ErrRecordNotFound {
			if err := db.Create(&item).Error; err != nil {
				return fmt.Errorf("seed proyek: %w", err)
			}
		} else if err != nil {
			return fmt.Errorf("baca proyek: %w", err)
		}
	}

	sertifikasiContoh := models.Sertifikasi{IDSertifikasi: 1, NamaSertifikat: "Dasar Pemrograman Go", Penerbit: "Belajar Mandiri", TanggalTerbit: datePointer(2025, 2, 1), NomorSertifikat: "GO-001", Deskripsi: "Contoh data sertifikasi.", UrutanTampil: 1}
	var sertifikasi models.Sertifikasi
	if err := db.First(&sertifikasi, 1).Error; err == gorm.ErrRecordNotFound {
		if err := db.Create(&sertifikasiContoh).Error; err != nil {
			return fmt.Errorf("seed sertifikasi: %w", err)
		}
	} else if err != nil {
		return fmt.Errorf("baca sertifikasi: %w", err)
	}

	mediaSosialContoh := models.MediaSosial{IDMediaSosial: 1, NamaPlatform: "GitHub", NamaAkun: "username", IDIkon: uintPointer(1), URLTujuan: "https://github.com/username", UrutanTampil: 1}
	var mediaSosial models.MediaSosial
	if err := db.First(&mediaSosial, 1).Error; err == gorm.ErrRecordNotFound {
		if err := db.Create(&mediaSosialContoh).Error; err != nil {
			return fmt.Errorf("seed media sosial: %w", err)
		}
	} else if err != nil {
		return fmt.Errorf("baca media sosial: %w", err)
	}

	teknologiProfilContoh := models.TeknologiProfil{IDTeknologiProfil: 1, IDTeknologi: 1, Prioritas: 1}
	var teknologiProfil models.TeknologiProfil
	if err := db.First(&teknologiProfil, 1).Error; err == gorm.ErrRecordNotFound {
		if err := db.Create(&teknologiProfilContoh).Error; err != nil {
			return fmt.Errorf("seed teknologi profil: %w", err)
		}
	} else if err != nil {
		return fmt.Errorf("baca teknologi profil: %w", err)
	}

	teknologiProyekContoh := []models.TeknologiProyek{
		{IDTeknologiProyek: 1, IDProyek: 2, IDTeknologi: 1, Kategori: "Backend"},
		{IDTeknologiProyek: 2, IDProyek: 2, IDTeknologi: 2, Kategori: "Frontend"},
	}
	for _, item := range teknologiProyekContoh {
		var data models.TeknologiProyek
		if err := db.First(&data, item.IDTeknologiProyek).Error; err == gorm.ErrRecordNotFound {
			if err := db.Create(&item).Error; err != nil {
				return fmt.Errorf("seed teknologi proyek: %w", err)
			}
		} else if err != nil {
			return fmt.Errorf("baca teknologi proyek: %w", err)
		}
	}
	return nil
}

func uintPointer(value uint) *uint { return &value }

func datePointer(year int, month time.Month, day int) *time.Time {
	date := time.Date(year, month, day, 0, 0, 0, 0, time.UTC)
	return &date
}
