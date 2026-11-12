package models

import "time"

type Profil struct {
	IDProfil             uint      `gorm:"column:id_profil;primaryKey" json:"id_profil"`
	NamaLengkap          string    `gorm:"column:nama_lengkap;not null" json:"nama_lengkap"`
	URLFotoProfil        string    `gorm:"column:url_foto_profil;type:varchar(2048)" json:"url_foto_profil"`
	JabatanProfesional   string    `gorm:"column:jabatan_profesional" json:"jabatan_profesional"`
	Lokasi               string    `gorm:"column:lokasi" json:"lokasi"`
	Email                string    `gorm:"column:email" json:"email"`
	Biografi             string    `gorm:"column:biografi;type:text" json:"biografi"`
	DeskripsiTentangSaya string    `gorm:"column:deskripsi_tentang_saya;type:text" json:"deskripsi_tentang_saya"`
	DiubahPada           time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

func (Profil) TableName() string { return "profile" }

type ProfilRequest struct {
	NamaLengkap          string `json:"nama_lengkap" form:"nama_lengkap"`
	URLFotoProfil        string `json:"url_foto_profil" form:"url_foto_profil"`
	JabatanProfesional   string `json:"jabatan_profesional" form:"jabatan_profesional"`
	Lokasi               string `json:"lokasi" form:"lokasi"`
	Email                string `json:"email" form:"email"`
	Biografi             string `json:"biografi" form:"biografi"`
	DeskripsiTentangSaya string `json:"deskripsi_tentang_saya" form:"deskripsi_tentang_saya"`
}
