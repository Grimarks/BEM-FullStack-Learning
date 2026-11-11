package models

import "time"

type Teknologi struct {
	IDTeknologi   uint      `gorm:"column:id_teknologi;primaryKey;autoIncrement" json:"id_teknologi"`
	NamaTeknologi string    `gorm:"column:nama_teknologi;not null;uniqueIndex" json:"nama_teknologi"`
	IDIkon        *uint     `gorm:"column:id_ikon;index" json:"id_ikon"`
	Ikon          *Ikon     `gorm:"BELONGSTO;foreignKey:IDIkon;references:IDIkon" json:"ikon,omitempty"`
	DibuatPada    time.Time `gorm:"column:created_at;autoCreateTime" json:"created_at"`
	DiubahPada    time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

func (Teknologi) TableName() string { return "teknologi" }

type PermintaanTeknologi struct {
	NamaTeknologi string `json:"nama_teknologi"`
	IDIkon        *uint  `json:"id_ikon"`
}
