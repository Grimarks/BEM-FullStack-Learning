package handlers

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"strings"
	"time"

	"bem-portfolio/backend/middleware"
	"bem-portfolio/backend/models"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func (h *Handler) Login(c *fiber.Ctx) error {
	var input models.PermintaanLogin
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
	}
	var account models.Autentikasi
	if err := h.DB.First(&account, 1).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if strings.TrimSpace(input.NamaPengguna) != account.NamaPengguna || bcrypt.CompareHashAndPassword([]byte(account.HashKataSandi), []byte(input.KataSandi)) != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Nama pengguna atau kata sandi salah",
		})
	}
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	token := base64.RawURLEncoding.EncodeToString(bytes)
	sum := sha256.Sum256([]byte(token))
	tokenHash := hex.EncodeToString(sum[:])
	expires := time.Now().Add(time.Duration(h.Cfg.SessionHours) * time.Hour)
	if err := h.DB.Model(&models.Autentikasi{}).Where("id_auth = ?", 1).Updates(map[string]any{"token_hash": tokenHash, "expires_at": expires}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	c.Cookie(&fiber.Cookie{Name: middleware.CookieName, Value: token, Path: "/", HTTPOnly: true, Secure: strings.EqualFold(h.Cfg.Env, "production"), SameSite: "Strict", Expires: expires, MaxAge: int(time.Until(expires).Seconds())})
	return c.JSON(fiber.Map{
		"message":    "Login berhasil",
		"username":   account.NamaPengguna,
		"expires_at": expires,
	})
}

func (h *Handler) Logout(c *fiber.Ctx) error {
	if err := h.DB.Model(&models.Autentikasi{}).Where("id_auth = ?", 1).Updates(map[string]any{"token_hash": "", "expires_at": nil}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	c.Cookie(&fiber.Cookie{Name: middleware.CookieName, Value: "", Path: "/", HTTPOnly: true, Secure: strings.EqualFold(h.Cfg.Env, "production"), SameSite: "Strict", Expires: time.Unix(0, 0), MaxAge: -1})
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *Handler) Me(c *fiber.Ctx) error {
	account, ok := c.Locals("auth").(models.Autentikasi)
	if !ok {
		return fiber.NewError(fiber.StatusUnauthorized, "Sesi tidak valid")
	}
	return c.JSON(fiber.Map{
		"username": account.NamaPengguna,
	})
}

func (h *Handler) ChangePassword(c *fiber.Ctx) error {
	var input models.PermintaanGantiKataSandi
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
	}
	if len(input.KataSandiBaru) < 12 || len(input.KataSandiBaru) > 72 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Password baru harus 12 sampai 72 byte",
		})
	}
	var account models.Autentikasi
	if err := h.DB.First(&account, 1).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if bcrypt.CompareHashAndPassword([]byte(account.HashKataSandi), []byte(input.KataSandiLama)) != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Password lama tidak cocok",
		})
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(input.KataSandiBaru), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if err := h.DB.Model(&models.Autentikasi{}).Where("id_auth = ?", 1).Updates(map[string]any{"password_hash": string(hash), "token_hash": "", "expires_at": nil}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	c.Cookie(&fiber.Cookie{Name: middleware.CookieName, Value: "", Path: "/", HTTPOnly: true, Secure: strings.EqualFold(h.Cfg.Env, "production"), SameSite: "Strict", Expires: time.Unix(0, 0), MaxAge: -1})
	return c.JSON(fiber.Map{
		"message": "Password diperbarui. Silakan login kembali.",
	})
}
