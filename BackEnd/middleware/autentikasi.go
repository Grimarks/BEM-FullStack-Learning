package middleware

import (
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"time"

	"bem-portfolio/backend/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

const CookieName = "portfolio_session"

func Session(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		cookie := c.Cookies(CookieName)
		if cookie == "" {
			return fiber.NewError(fiber.StatusUnauthorized, "Sesi tidak valid")
		}
		sum := sha256.Sum256([]byte(cookie))
		provided := hex.EncodeToString(sum[:])
		var account models.Autentikasi
		if err := db.First(&account, 1).Error; err != nil {
			return fiber.NewError(fiber.StatusUnauthorized, "Sesi tidak valid")
		}
		if len(account.HashToken) != len(provided) || subtle.ConstantTimeCompare([]byte(account.HashToken), []byte(provided)) != 1 || account.WaktuKadaluarsa == nil || time.Now().After(*account.WaktuKadaluarsa) {
			return fiber.NewError(fiber.StatusUnauthorized, "Sesi tidak valid atau sudah kedaluwarsa")
		}
		c.Locals("auth", account)
		return c.Next()
	}
}
