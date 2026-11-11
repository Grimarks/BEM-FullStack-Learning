package models

import "time"

type MediaSosial struct {
	IDMediaSosial uint      `gorm:"column:id_media_sosial;primaryKey;autoIncrement" json:"id_media_sosial"`
	NamaPlatform  string    `gorm:"column:nama_platform;not null" json:"nama_platform"`
	NamaAkun      string    `gorm:"column:nama_akun;not null" json:"nama_akun"`
	IDIkon        *uint     `gorm:"column:id_ikon;index" json:"id_ikon"`
	URLTujuan     string    `gorm:"column:url_tujuan;type:varchar(2048);not null" json:"url_tujuan"`
	UrutanTampil  int       `gorm:"column:sort_order;not null;default:0" json:"sort_order"`
	Ikon          *Ikon     `gorm:"BELONGSTO;foreignKey:IDIkon;references:IDIkon" json:"ikon,omitempty"`
	DibuatPada    time.Time `gorm:"column:created_at;autoCreateTime" json:"created_at"`
	DiubahPada    time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

func (MediaSosial) TableName() string { return "media_sosial" }

type PermintaanMediaSosial struct {
	NamaPlatform string `json:"nama_platform"`
	NamaAkun     string `json:"nama_akun"`
	IDIkon       *uint  `json:"id_ikon"`
	URLTujuan    string `json:"url_tujuan"`
	UrutanTampil int    `json:"sort_order"`
}
