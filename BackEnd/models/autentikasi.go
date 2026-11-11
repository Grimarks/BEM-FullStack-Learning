package models

import "time"

type Autentikasi struct {
	IDAutentikasi   uint       `gorm:"column:id_auth;primaryKey" json:"-"`
	NamaPengguna    string     `gorm:"column:username;uniqueIndex;not null" json:"username"`
	HashKataSandi   string     `gorm:"column:password_hash;not null" json:"-"`
	HashToken       string     `gorm:"column:token_hash" json:"-"`
	WaktuKadaluarsa *time.Time `gorm:"column:expires_at" json:"-"`
	DibuatPada      time.Time  `gorm:"column:created_at;autoCreateTime" json:"-"`
	DiubahPada      time.Time  `gorm:"column:updated_at;autoUpdateTime" json:"-"`
}

func (Autentikasi) TableName() string { return "auth" }

type PermintaanLogin struct {
	NamaPengguna string `json:"username"`
	KataSandi    string `json:"password"`
}

type PermintaanGantiKataSandi struct {
	KataSandiLama string `json:"current_password"`
	KataSandiBaru string `json:"new_password"`
}
