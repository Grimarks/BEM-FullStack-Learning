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
	var input models.PermintaanPerbaruiKontenWebsite
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
	updates := map[string]any{
		"deskripsi_footer": input.DeskripsiFooter, "teks_hak_cipta": input.TeksHakCipta,
		"teks_tambahan_footer": input.TeksTambahanFooter, "nama_tampilan": input.NamaTampilan,
		"label_profesi": input.LabelProfesi, "judul_utama": input.JudulUtama,
		"teks_utama_hero": input.TeksUtamaHero, "teks_pendukung": input.TeksPendukung,
		"teks_hero_lainnya": input.TeksHeroLainnya, "deskripsi": input.Deskripsi,
		"teks_tombol_cta": input.TeksTombolCTA, "url_tujuan_cta": input.URLTujuanCTA,
	}
	if err := h.DB.Model(&models.KontenWebsite{}).Where("id_konten = ?", 1).Updates(updates).Error; err != nil {
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
	var input models.PermintaanPerbaruiProfil
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
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
	updates := map[string]any{
		"nama_lengkap": input.NamaLengkap, "url_foto_profil": input.URLFotoProfil,
		"jabatan_profesional": input.JabatanProfesional, "lokasi": input.Lokasi,
		"email": input.Email, "biografi": input.Biografi,
		"deskripsi_tentang_saya": input.DeskripsiTentangSaya,
	}
	if err := h.DB.Model(&models.Profil{}).Where("id_profil = ?", 1).Updates(updates).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return h.GetProfile(c)
}
