package models

import "time"

type KontenWebsite struct {
	IDKonten           uint      `gorm:"column:id_konten;primaryKey" json:"id_konten"`
	DeskripsiFooter    string    `gorm:"column:deskripsi_footer;type:text" json:"deskripsi_footer"`
	TeksHakCipta       string    `gorm:"column:teks_hak_cipta;type:text" json:"teks_hak_cipta"`
	TeksTambahanFooter string    `gorm:"column:teks_tambahan_footer;type:text" json:"teks_tambahan_footer"`
	NamaTampilan       string    `gorm:"column:nama_tampilan;not null" json:"nama_tampilan"`
	LabelProfesi       string    `gorm:"column:label_profesi;type:text" json:"label_profesi"`
	JudulUtama         string    `gorm:"column:judul_utama;not null" json:"judul_utama"`
	TeksUtamaHero      string    `gorm:"column:teks_utama_hero;type:text" json:"teks_utama_hero"`
	TeksPendukung      string    `gorm:"column:teks_pendukung;type:text" json:"teks_pendukung"`
	TeksHeroLainnya    string    `gorm:"column:teks_hero_lainnya;type:text" json:"teks_hero_lainnya"`
	Deskripsi          string    `gorm:"column:deskripsi;type:text" json:"deskripsi"`
	TeksTombolCTA      string    `gorm:"column:teks_tombol_cta" json:"teks_tombol_cta"`
	URLTujuanCTA       string    `gorm:"column:url_tujuan_cta;type:varchar(2048)" json:"url_tujuan_cta"`
	DiubahPada         time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

func (KontenWebsite) TableName() string { return "website_content" }

type PermintaanPerbaruiKontenWebsite struct {
	DeskripsiFooter    string `json:"deskripsi_footer"`
	TeksHakCipta       string `json:"teks_hak_cipta"`
	TeksTambahanFooter string `json:"teks_tambahan_footer"`
	NamaTampilan       string `json:"nama_tampilan"`
	LabelProfesi       string `json:"label_profesi"`
	JudulUtama         string `json:"judul_utama"`
	TeksUtamaHero      string `json:"teks_utama_hero"`
	TeksPendukung      string `json:"teks_pendukung"`
	TeksHeroLainnya    string `json:"teks_hero_lainnya"`
	Deskripsi          string `json:"deskripsi"`
	TeksTombolCTA      string `json:"teks_tombol_cta"`
	URLTujuanCTA       string `json:"url_tujuan_cta"`
}
