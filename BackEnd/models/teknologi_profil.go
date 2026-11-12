package models

import "time"

type TeknologiProfil struct {
	IDTeknologiProfil uint      `gorm:"column:id_teknologi_profil;primaryKey;autoIncrement" json:"id_teknologi_profil"`
	IDTeknologi       uint      `gorm:"column:id_teknologi;not null;uniqueIndex:uidx_teknologi_profil_teknologi" json:"id_teknologi"`
	Prioritas         int       `gorm:"column:prioritas;not null;default:100;index" json:"prioritas"`
	Teknologi         Teknologi `gorm:"BELONGSTO;foreignKey:IDTeknologi;references:IDTeknologi" json:"teknologi,omitempty"`
	DibuatPada        time.Time `gorm:"column:created_at;autoCreateTime" json:"created_at"`
	DiubahPada        time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

func (TeknologiProfil) TableName() string { return "teknologi_profil" }

type PermintaanTeknologiProfil struct {
	IDTeknologi uint `json:"id_teknologi"`
	Prioritas   int  `json:"prioritas"`
}
