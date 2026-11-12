package handlers

import (
	"strings"

	"bem-portfolio/backend/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func mediaSosialDariInput(db *gorm.DB, in models.PermintaanMediaSosial) (models.MediaSosial, error) {
	in.NamaPlatform, in.NamaAkun = strings.TrimSpace(in.NamaPlatform), strings.TrimSpace(in.NamaAkun)
	if in.NamaPlatform == "" || in.NamaAkun == "" {
		return models.MediaSosial{}, fiber.NewError(400, "Nama platform dan nama akun wajib diisi")
	}
	if !validLink(in.URLTujuan) {
		return models.MediaSosial{}, fiber.NewError(400, "URL tujuan harus berupa https://..., #bagian, /path, atau mailto:email")
	}
	if in.IDIkon != nil {
		var icon models.Ikon
		if err := db.First(&icon, "id_ikon = ?", *in.IDIkon).Error; err != nil {
			return models.MediaSosial{}, fiber.NewError(400, "Ikon tidak ditemukan")
		}
	}
	return models.MediaSosial{NamaPlatform: in.NamaPlatform, NamaAkun: in.NamaAkun, IDIkon: in.IDIkon, URLTujuan: in.URLTujuan, UrutanTampil: in.UrutanTampil}, nil
}
func (h *Handler) ListMediaSosial(c *fiber.Ctx) error {
	var items []models.MediaSosial
	if err := h.DB.Preload("Ikon").Order("sort_order ASC").Order("id_media_sosial ASC").Find(&items).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return c.JSON(fiber.Map{
		"data": items,
	})
}
func (h *Handler) CreateMediaSosial(c *fiber.Ctx) error {
	var input models.PermintaanMediaSosial
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
	}
	item, err := mediaSosialDariInput(h.DB, input)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	if err := h.DB.Create(&item).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return c.Status(201).JSON(item)
}
func (h *Handler) GetMediaSosial(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var item models.MediaSosial
	if err := h.DB.Preload("Ikon").First(&item, "id_media_sosial = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Media sosial tidak ditemukan",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return c.JSON(item)
}
func (h *Handler) UpdateMediaSosial(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var input models.PermintaanMediaSosial
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
	}
	item, err := mediaSosialDariInput(h.DB, input)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	res := h.DB.Model(&models.MediaSosial{}).Where("id_media_sosial = ?", id).Updates(map[string]any{"nama_platform": item.NamaPlatform, "nama_akun": item.NamaAkun, "id_ikon": item.IDIkon, "url_tujuan": item.URLTujuan, "sort_order": item.UrutanTampil})
	if res.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if res.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Media sosial tidak ditemukan",
		})
	}
	return h.GetMediaSosial(c)
}
func (h *Handler) DeleteMediaSosial(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	res := h.DB.Delete(&models.MediaSosial{}, "id_media_sosial = ?", id)
	if res.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if res.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Media sosial tidak ditemukan",
		})
	}
	return c.SendStatus(204)
}
