package models

import "time"

type Sertifikasi struct {
	IDSertifikasi     uint       `gorm:"column:id_sertifikasi;primaryKey;autoIncrement" json:"id_sertifikasi"`
	NamaSertifikat    string     `gorm:"column:nama_sertifikat;not null" json:"nama_sertifikat"`
	Penerbit          string     `gorm:"column:penerbit;not null" json:"penerbit"`
	TanggalTerbit     *time.Time `gorm:"column:tanggal_terbit;index" json:"tanggal_terbit"`
	TanggalKadaluarsa *time.Time `gorm:"column:tanggal_kadaluarsa" json:"tanggal_kadaluarsa"`
	NomorSertifikat   string     `gorm:"column:nomor_sertifikat" json:"nomor_sertifikat"`
	URLSertifikat     string     `gorm:"column:url_sertifikat;type:varchar(2048)" json:"url_sertifikat"`
	Deskripsi         string     `gorm:"column:deskripsi;type:text" json:"deskripsi"`
	UrutanTampil      int        `gorm:"column:sort_order;not null;default:0" json:"sort_order"`
	DibuatPada        time.Time  `gorm:"column:created_at;autoCreateTime" json:"created_at"`
	DiubahPada        time.Time  `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

func (Sertifikasi) TableName() string { return "sertifikasi" }

type PermintaanSertifikasi struct {
	NamaSertifikat    string `json:"nama_sertifikat"`
	Penerbit          string `json:"penerbit"`
	TanggalTerbit     string `json:"tanggal_terbit"`
	TanggalKadaluarsa string `json:"tanggal_kadaluarsa"`
	NomorSertifikat   string `json:"nomor_sertifikat"`
	URLSertifikat     string `json:"url_sertifikat"`
	Deskripsi         string `json:"deskripsi"`
	UrutanTampil      int    `json:"sort_order"`
}
