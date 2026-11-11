package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func (h *Handler) Upload(c *fiber.Ctx) error {
	purpose := c.FormValue("purpose")
	if !oneOf(purpose, "profile", "project", "certificate", "icon") {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Purpose harus profile, project, certificate, atau icon",
		})
	}
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "File wajib diunggah dengan field bernama file",
		})
	}
	if file.Size < 1 || file.Size > h.Cfg.MaxUploadBytes {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Ukuran file tidak valid atau melebihi batas",
		})
	}
	opened, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "File tidak dapat dibaca",
		})
	}
	buffer := make([]byte, 512)
	n, readErr := opened.Read(buffer)
	_ = opened.Close()
	if readErr != nil && n == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "File tidak dapat dibaca",
		})
	}
	mime := http.DetectContentType(buffer[:n])
	extensions := map[string]string{"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
	ext, ok := extensions[mime]
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Hanya gambar JPEG, PNG, dan WebP yang diterima",
		})
	}
	if err := os.MkdirAll(filepath.Join(h.Cfg.UploadDir, purpose), 0750); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	randomBytes := make([]byte, 16)
	if _, err := rand.Read(randomBytes); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	name := hex.EncodeToString(randomBytes) + ext
	destination := filepath.Join(h.Cfg.UploadDir, purpose, name)
	if err := c.SaveFile(file, destination); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	url := "/uploads/" + purpose + "/" + strings.ReplaceAll(name, "\\", "")
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"url":       url,
		"mime_type": mime,
		"size":      file.Size,
		"filename":  name,
	})
}
