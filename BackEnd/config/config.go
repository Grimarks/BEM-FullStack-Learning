package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Env            string
	Port           string
	DatabaseDSN    string
	FrontendOrigin string
	AdminUsername  string
	AdminPassword  string
	SessionHours   int
	UploadDir      string
	MaxUploadBytes int64
}

func Load() (Config, error) {
	_ = godotenv.Load()
	maxMB, err := strconv.Atoi(env("MAX_UPLOAD_MB", "5"))
	if err != nil || maxMB < 1 || maxMB > 20 {
		return Config{}, fmt.Errorf("MAX_UPLOAD_MB harus antara 1 dan 20")
	}
	hours, err := strconv.Atoi(env("SESSION_HOURS", "12"))
	if err != nil || hours < 1 || hours > 168 {
		return Config{}, fmt.Errorf("SESSION_HOURS harus antara 1 dan 168")
	}
	origin := strings.TrimRight(env("FRONTEND_ORIGIN", "http://localhost:5173"), "/")
	if origin == "" || origin == "*" {
		return Config{}, fmt.Errorf("FRONTEND_ORIGIN harus berisi satu origin eksplisit")
	}
	dsn := env("DATABASE_DSN", "")
	if dsn == "" {
		return Config{}, fmt.Errorf("DATABASE_DSN wajib diisi")
	}
	return Config{
		Env:            env("APP_ENV", "development"),
		Port:           env("PORT", "8080"),
		DatabaseDSN:    dsn,
		FrontendOrigin: origin,
		AdminUsername:  env("ADMIN_USERNAME", "admin"),
		AdminPassword:  os.Getenv("ADMIN_PASSWORD"),
		SessionHours:   hours,
		UploadDir:      env("UPLOAD_DIR", "uploads"),
		MaxUploadBytes: int64(maxMB) * 1024 * 1024,
	}, nil
}

func env(key, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(key)); value != "" {
		return value
	}
	return fallback
}
