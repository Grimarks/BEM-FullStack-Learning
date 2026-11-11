package handlers

import (
	"strings"

	"bem-portfolio/backend/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func ikonDariInput(in models.PermintaanIkon) (models.Ikon, error) {
	in.NamaIkon = strings.TrimSpace(in.NamaIkon)
	if in.NamaIkon == "" || in.URLIkon == "" {
		return models.Ikon{}, fiber.NewError(400, "Nama dan URL ikon wajib diisi")
	}
	if !oneOf(in.Kategori, "media_sosial", "teknologi") {
		return models.Ikon{}, fiber.NewError(400, "Kategori ikon tidak valid")
	}
	if !validImagePath(in.URLIkon) {
		return models.Ikon{}, fiber.NewError(400, "URL ikon tidak valid")
	}
	return models.Ikon{NamaIkon: in.NamaIkon, URLIkon: in.URLIkon, Kategori: in.Kategori}, nil
}

func (h *Handler) ListIkon(c *fiber.Ctx) error {
	var items []models.Ikon
	query := h.DB.Order("kategori_ikon ASC").Order("nama_ikon ASC")
	if category := c.Query("category"); category != "" {
		query = query.Where("kategori_ikon = ?", category)
	}
	if err := query.Find(&items).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return c.JSON(fiber.Map{
		"data": items,
	})
}
func (h *Handler) CreateIkon(c *fiber.Ctx) error {
	var input models.PermintaanIkon
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
	}
	item, err := ikonDariInput(input)
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
func (h *Handler) GetIkon(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var item models.Ikon
	if err := h.DB.First(&item, "id_ikon = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Ikon tidak ditemukan",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return c.JSON(item)
}
func (h *Handler) UpdateIkon(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var input models.PermintaanIkon
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
	}
	item, err := ikonDariInput(input)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	res := h.DB.Model(&models.Ikon{}).Where("id_ikon = ?", id).Updates(map[string]any{"nama_ikon": item.NamaIkon, "url_ikon": item.URLIkon, "kategori_ikon": item.Kategori})
	if res.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if res.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Ikon tidak ditemukan",
		})
	}
	return h.GetIkon(c)
}
func (h *Handler) DeleteIkon(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var count int64
	if err := h.DB.Model(&models.Teknologi{}).Where("id_ikon = ?", id).Count(&count).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if count > 0 {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Ikon masih dipakai teknologi",
		})
	}
	if err := h.DB.Model(&models.MediaSosial{}).Where("id_ikon = ?", id).Count(&count).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if count > 0 {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Ikon masih dipakai media sosial",
		})
	}
	res := h.DB.Delete(&models.Ikon{}, "id_ikon = ?", id)
	if res.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if res.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Ikon tidak ditemukan",
		})
	}
	return c.SendStatus(204)
}
