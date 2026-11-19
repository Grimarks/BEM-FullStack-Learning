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

func (h *Handler) simpanGambar(c *fiber.Ctx, tujuan string) (string, error) {
	if !strings.HasPrefix(c.Get("Content-Type"), "multipart/form-data") {
		return "", nil
	}
	form, err := c.Context().MultipartForm()
	if err != nil {
		return "", fiber.NewError(fiber.StatusBadRequest, "Form multipart tidak valid")
	}
	files := form.File["file"]
	if len(files) == 0 {
		return "", nil
	}
	file := files[0]
	if file.Size < 1 || file.Size > h.Cfg.MaxUploadBytes {
		return "", fiber.NewError(fiber.StatusBadRequest, "Ukuran file tidak valid atau melebihi batas")
	}
	opened, err := file.Open()
	if err != nil {
		return "", fiber.NewError(fiber.StatusBadRequest, "File tidak dapat dibaca")
	}
	buffer := make([]byte, 512)
	n, readErr := opened.Read(buffer)
	_ = opened.Close()
	if readErr != nil && n == 0 {
		return "", fiber.NewError(fiber.StatusBadRequest, "File tidak dapat dibaca")
	}
	mime := http.DetectContentType(buffer[:n])
	extensions := map[string]string{"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
	ext, ok := extensions[mime]
	if !ok {
		return "", fiber.NewError(fiber.StatusBadRequest, "Hanya gambar JPEG, PNG, dan WebP yang diterima")
	}
	if err := os.MkdirAll(filepath.Join(h.Cfg.UploadDir, tujuan), 0750); err != nil {
		return "", fiber.NewError(fiber.StatusInternalServerError, "Terjadi kesalahan pada server")
	}
	randomBytes := make([]byte, 16)
	if _, err := rand.Read(randomBytes); err != nil {
		return "", fiber.NewError(fiber.StatusInternalServerError, "Terjadi kesalahan pada server")
	}
	name := hex.EncodeToString(randomBytes) + ext
	destination := filepath.Join(h.Cfg.UploadDir, tujuan, name)
	if err := c.SaveFile(file, destination); err != nil {
		return "", fiber.NewError(fiber.StatusInternalServerError, "Terjadi kesalahan pada server")
	}
	return "/uploads/" + tujuan + "/" + name, nil
}
