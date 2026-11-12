package handlers

import (
	"strings"
	"time"

	"bem-portfolio/backend/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func experienceFromInput(in models.PermintaanPerjalanan) (models.Perjalanan, error) {
	institution := strings.TrimSpace(in.Institusi)
	if institution == "" {
		return models.Perjalanan{}, fiber.NewError(400, "Institusi wajib diisi")
	}
	if !oneOf(in.Kategori, "pekerjaan", "magang", "pendidikan", "pelatihan") {
		return models.Perjalanan{}, fiber.NewError(400, "Kategori perjalanan tidak valid")
	}
	startValue, err := parseDate(in.TanggalMulai, false)
	if err != nil {
		return models.Perjalanan{}, fiber.NewError(400, "Tanggal mulai wajib menggunakan format YYYY-MM-DD")
	}
	start := *startValue
	end, err := parseDate(in.TanggalSelesai, true)
	if err != nil {
		return models.Perjalanan{}, fiber.NewError(400, "Tanggal selesai harus menggunakan format YYYY-MM-DD")
	}
	if end != nil && end.Before(start) {
		return models.Perjalanan{}, fiber.NewError(400, "Tanggal selesai tidak boleh sebelum tanggal mulai")
	}
	return models.Perjalanan{Institusi: institution, Kategori: in.Kategori, TanggalMulai: start, TanggalSelesai: end, InformasiTambahan: in.InformasiTambahan, Deskripsi: in.Deskripsi, UrutanTampil: in.UrutanTampil}, nil
}

func parseDate(value string, optional bool) (*time.Time, error) {
	if strings.TrimSpace(value) == "" {
		if optional {
			return nil, nil
		}
		return nil, fiber.NewError(400, "tanggal wajib")
	}
	d, err := time.Parse("2006-01-02", value)
	if err != nil {
		return nil, err
	}
	return &d, nil
}

func oneOf(value string, choices ...string) bool {
	for _, choice := range choices {
		if value == choice {
			return true
		}
	}
	return false
}

func (h *Handler) ListExperiences(c *fiber.Ctx) error {
	page, limit, err := pagination(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var items []models.Perjalanan
	var total int64
	if err := h.DB.Model(&models.Perjalanan{}).Count(&total).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if err := h.DB.Order("sort_order ASC").Order("tanggal_mulai DESC").Offset((page - 1) * limit).Limit(limit).Find(&items).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return c.JSON(pageResult(items, page, limit, total))
}

func (h *Handler) CreateExperience(c *fiber.Ctx) error {
	var input models.PermintaanPerjalanan
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
	}
	item, err := experienceFromInput(input)
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
	return c.Status(fiber.StatusCreated).JSON(item)
}

func (h *Handler) GetExperience(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var item models.Perjalanan
	if err := h.DB.First(&item, "id_perjalanan = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Perjalanan tidak ditemukan",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return c.JSON(item)
}

func (h *Handler) UpdateExperience(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var input models.PermintaanPerjalanan
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
	}
	item, err := experienceFromInput(input)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	result := h.DB.Model(&models.Perjalanan{}).Where("id_perjalanan = ?", id).Updates(map[string]any{
		"institusi": item.Institusi, "kategori": item.Kategori, "tanggal_mulai": item.TanggalMulai,
		"tanggal_selesai": item.TanggalSelesai, "informasi_tambahan": item.InformasiTambahan,
		"deskripsi": item.Deskripsi, "sort_order": item.UrutanTampil,
	})
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Perjalanan tidak ditemukan",
		})
	}
	return h.GetExperience(c)
}

func (h *Handler) DeleteExperience(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	result := h.DB.Delete(&models.Perjalanan{}, "id_perjalanan = ?", id)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Perjalanan tidak ditemukan",
		})
	}
	return c.SendStatus(fiber.StatusNoContent)
}

func pageResult(data any, page, limit int, total int64) fiber.Map {
	pages := int64(0)
	if total > 0 {
		pages = (total + int64(limit) - 1) / int64(limit)
	}
	return fiber.Map{"data": data, "pagination": fiber.Map{"page": page, "limit": limit, "total_items": total, "total_pages": pages}}
}
