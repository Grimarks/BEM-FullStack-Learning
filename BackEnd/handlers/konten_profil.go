package handlers

import (
	"net/mail"
	"strings"

	"bem-portfolio/backend/models"

	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetContent(c *fiber.Ctx) error {
	var item models.KontenWebsite
	if err := h.DB.First(&item, 1).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return c.JSON(item)
}

func (h *Handler) UpdateContent(c *fiber.Ctx) error {
	var input models.KontenWebsiteRequest
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
	}
	input.NamaTampilan = strings.TrimSpace(input.NamaTampilan)
	input.JudulUtama = strings.TrimSpace(input.JudulUtama)
	if input.NamaTampilan == "" || input.JudulUtama == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Nama tampilan dan judul utama wajib diisi",
		})
	}
	if !validLink(input.URLTujuanCTA) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "URL CTA harus berupa https://..., #bagian, /path, atau mailto:email",
		})
	}
	var konten models.KontenWebsite
	if err := h.DB.First(&konten, 1).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	konten.DeskripsiFooter = input.DeskripsiFooter
	konten.TeksHakCipta = input.TeksHakCipta
	konten.TeksTambahanFooter = input.TeksTambahanFooter
	konten.NamaTampilan = input.NamaTampilan
	konten.LabelProfesi = input.LabelProfesi
	konten.JudulUtama = input.JudulUtama
	konten.TeksUtamaHero = input.TeksUtamaHero
	konten.TeksPendukung = input.TeksPendukung
	konten.TeksHeroLainnya = input.TeksHeroLainnya
	konten.Deskripsi = input.Deskripsi
	konten.TeksTombolCTA = input.TeksTombolCTA
	konten.URLTujuanCTA = input.URLTujuanCTA
	if err := h.DB.Save(&konten).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return h.GetContent(c)
}

func (h *Handler) GetProfile(c *fiber.Ctx) error {
	var item models.Profil
	if err := h.DB.First(&item, 1).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return c.JSON(item)
}

func (h *Handler) UpdateProfile(c *fiber.Ctx) error {
	var input models.ProfilRequest
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body request tidak valid",
		})
	}
	urlGambar, err := h.simpanGambar(c, "profile")
	if err != nil {
		fiberErr, ok := err.(*fiber.Error)
		if !ok {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Terjadi kesalahan pada server"})
		}
		return c.Status(fiberErr.Code).JSON(fiber.Map{"error": fiberErr.Message})
	}
	if urlGambar != "" {
		input.URLFotoProfil = urlGambar
	}
	input.NamaLengkap = strings.TrimSpace(input.NamaLengkap)
	if input.NamaLengkap == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Nama lengkap wajib diisi",
		})
	}
	if !validImagePath(input.URLFotoProfil) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "URL foto harus berupa URL HTTP/HTTPS atau path upload",
		})
	}
	if input.Email != "" {
		address, err := mail.ParseAddress(input.Email)
		if err != nil || address.Address != input.Email {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Format email tidak valid",
			})
		}
	}
	var profil models.Profil
	if err := h.DB.First(&profil, 1).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	profil.NamaLengkap = input.NamaLengkap
	profil.URLFotoProfil = input.URLFotoProfil
	profil.JabatanProfesional = input.JabatanProfesional
	profil.Lokasi = input.Lokasi
	profil.Email = input.Email
	profil.Biografi = input.Biografi
	profil.DeskripsiTentangSaya = input.DeskripsiTentangSaya
	if err := h.DB.Save(&profil).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return h.GetProfile(c)
}
