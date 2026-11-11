package models

import "time"

type TeknologiProyek struct {
	IDTeknologiProyek uint      `gorm:"column:id_teknologi_proyek;primaryKey;autoIncrement" json:"id_teknologi_proyek"`
	IDProyek          uint      `gorm:"column:id_proyek;not null;uniqueIndex:uidx_project_technology;index" json:"id_proyek"`
	IDTeknologi       uint      `gorm:"column:id_teknologi;not null;uniqueIndex:uidx_project_technology;index" json:"id_teknologi"`
	Kategori          string    `gorm:"column:kategori;not null" json:"kategori"`
	Proyek            Proyek    `gorm:"BELONGSTO;foreignKey:IDProyek;references:IDProyek" json:"-"`
	Teknologi         Teknologi `gorm:"BELONGSTO;foreignKey:IDTeknologi;references:IDTeknologi" json:"teknologi,omitempty"`
	DibuatPada        time.Time `gorm:"column:created_at;autoCreateTime" json:"created_at"`
	DiubahPada        time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

func (TeknologiProyek) TableName() string { return "teknologi_proyek" }

type PermintaanTeknologiProyek struct {
	IDTeknologi uint   `json:"id_teknologi"`
	Kategori    string `json:"kategori"`
}
