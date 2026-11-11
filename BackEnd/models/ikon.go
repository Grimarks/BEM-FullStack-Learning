package models

import "time"

type Ikon struct {
	IDIkon     uint      `gorm:"column:id_ikon;primaryKey;autoIncrement" json:"id_ikon"`
	NamaIkon   string    `gorm:"column:nama_ikon;not null" json:"nama_ikon"`
	URLIkon    string    `gorm:"column:url_ikon;type:varchar(2048);not null" json:"url_ikon"`
	Kategori   string    `gorm:"column:kategori_ikon;type:enum('media_sosial','teknologi');not null;index" json:"kategori_ikon"`
	DibuatPada time.Time `gorm:"column:created_at;autoCreateTime" json:"created_at"`
	DiubahPada time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

func (Ikon) TableName() string { return "ikon" }

type PermintaanIkon struct {
	NamaIkon string `json:"nama_ikon"`
	URLIkon  string `json:"url_ikon"`
	Kategori string `json:"kategori_ikon"`
}
