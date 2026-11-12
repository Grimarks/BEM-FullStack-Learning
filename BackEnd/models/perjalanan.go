package models

import (
	"time"
)

type Perjalanan struct {
	IDPerjalanan      uint       `gorm:"column:id_perjalanan;primaryKey;autoIncrement" json:"id_perjalanan"`
	Institusi         string     `gorm:"column:institusi;not null" json:"institusi"`
	Kategori          string     `gorm:"column:kategori;type:enum('pekerjaan','magang','pendidikan','pelatihan');not null;index" json:"kategori"`
	TanggalMulai      time.Time  `gorm:"column:tanggal_mulai;not null" json:"tanggal_mulai"`
	TanggalSelesai    *time.Time `gorm:"column:tanggal_selesai" json:"tanggal_selesai"`
	InformasiTambahan string     `gorm:"column:informasi_tambahan;type:text" json:"informasi_tambahan"`
	Deskripsi         string     `gorm:"column:deskripsi;type:text" json:"deskripsi"`
	UrutanTampil      int        `gorm:"column:sort_order;not null;default:0" json:"sort_order"`
	DibuatPada        time.Time  `gorm:"column:created_at;autoCreateTime" json:"created_at"`
	DiubahPada        time.Time  `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

func (Perjalanan) TableName() string { return "perjalanan" }

type PermintaanPerjalanan struct {
	Institusi         string `json:"institusi"`
	Kategori          string `json:"kategori"`
	TanggalMulai      string `json:"tanggal_mulai"`
	TanggalSelesai    string `json:"tanggal_selesai"`
	InformasiTambahan string `json:"informasi_tambahan"`
	Deskripsi         string `json:"deskripsi"`
	UrutanTampil      int    `json:"sort_order"`
}
