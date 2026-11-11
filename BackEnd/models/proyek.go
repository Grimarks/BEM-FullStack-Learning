package models

import "time"

type Proyek struct {
	IDProyek        uint       `gorm:"column:id_proyek;primaryKey;autoIncrement" json:"id_proyek"`
	Judul           string     `gorm:"column:judul_proyek;not null" json:"judul_proyek"`
	URLSampulProyek string     `gorm:"column:url_sampul_proyek;type:varchar(2048)" json:"url_sampul_proyek"`
	Kategori        string     `gorm:"column:kategori;type:enum('Mobile','Website','UI/UX','Machine Learning','Artificial Intelligence','Web3','Game Development');not null;index" json:"kategori"`
	Deskripsi       string     `gorm:"column:deskripsi;type:text" json:"deskripsi"`
	Tanggal         *time.Time `gorm:"column:tanggal;index" json:"tanggal"`
	URLDemo         string     `gorm:"column:url_demo;type:varchar(2048)" json:"url_demo"`
	URLGitHub       string     `gorm:"column:url_github;type:varchar(2048)" json:"url_github"`
	Status          string     `gorm:"column:status;type:enum('konsep','on-going','finished');not null;index" json:"status"`
	Prioritas       int        `gorm:"column:prioritas;not null;default:100;index" json:"prioritas"`
	DibuatPada      time.Time  `gorm:"column:created_at;autoCreateTime" json:"created_at"`
	DiubahPada      time.Time  `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

func (Proyek) TableName() string { return "proyek" }

type PermintaanProyek struct {
	Judul           string `json:"judul_proyek"`
	URLSampulProyek string `json:"url_sampul_proyek"`
	Kategori        string `json:"kategori"`
	Deskripsi       string `json:"deskripsi"`
	Tanggal         string `json:"tanggal"`
	URLDemo         string `json:"url_demo"`
	URLGitHub       string `json:"url_github"`
	Status          string `json:"status"`
	Prioritas       int    `json:"prioritas"`
}
