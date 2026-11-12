package handlers

import (
	"strings"

	"bem-portfolio/backend/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

var projectCategories = []string{"Mobile", "Website", "UI/UX", "Machine Learning", "Artificial Intelligence", "Web3", "Game Development"}

func projectFromInput(in models.PermintaanProyek) (models.Proyek, error) {
	in.Judul = strings.TrimSpace(in.Judul)
	if in.Judul == "" {
		return models.Proyek{}, fiber.NewError(400, "Judul proyek wajib diisi")
	}
	if !oneOf(in.Kategori, projectCategories...) {
		return models.Proyek{}, fiber.NewError(400, "Kategori proyek tidak valid")
	}
	if !oneOf(in.Status, "konsep", "on-going", "finished") {
		return models.Proyek{}, fiber.NewError(400, "Status proyek tidak valid")
	}
	if !validImagePath(in.URLSampulProyek) {
		return models.Proyek{}, fiber.NewError(400, "URL sampul tidak valid")
	}
	if !validURL(in.URLDemo) || !validURL(in.URLGitHub) {
		return models.Proyek{}, fiber.NewError(400, "URL demo/GitHub harus HTTP atau HTTPS")
	}
	date, err := parseDate(in.Tanggal, true)
	if err != nil {
		return models.Proyek{}, fiber.NewError(400, "Tanggal proyek harus YYYY-MM-DD")
	}
	return models.Proyek{Judul: in.Judul, URLSampulProyek: in.URLSampulProyek, Kategori: in.Kategori, Deskripsi: in.Deskripsi, Tanggal: date, URLDemo: in.URLDemo, URLGitHub: in.URLGitHub, Status: in.Status, Prioritas: in.Prioritas}, nil
}

func (h *Handler) ListProjects(c *fiber.Ctx) error {
	page, limit, err := pagination(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var items []models.Proyek
	var total int64
	if err := h.DB.Model(&models.Proyek{}).Count(&total).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if err := h.DB.Order("prioritas ASC").Order("tanggal DESC").Order("id_proyek ASC").Offset((page - 1) * limit).Limit(limit).Find(&items).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return c.JSON(pageResult(items, page, limit, total))
}

func (h *Handler) CreateProject(c *fiber.Ctx) error {
	var input models.PermintaanProyek
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
	}
	item, err := projectFromInput(input)
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

func (h *Handler) GetProject(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var item models.Proyek
	if err := h.DB.First(&item, "id_proyek = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Proyek tidak ditemukan",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	var links []models.TeknologiProyek
	if err := h.DB.Preload("Teknologi.Ikon").Where("id_proyek = ?", id).Order("id_teknologi_proyek ASC").Find(&links).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return c.JSON(fiber.Map{
		"project":      item,
		"technologies": links,
	})
}

func (h *Handler) UpdateProject(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var input models.PermintaanProyek
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
	}
	item, err := projectFromInput(input)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	result := h.DB.Model(&models.Proyek{}).Where("id_proyek = ?", id).Updates(map[string]any{
		"judul_proyek": item.Judul, "url_sampul_proyek": item.URLSampulProyek, "kategori": item.Kategori,
		"deskripsi": item.Deskripsi, "tanggal": item.Tanggal, "url_demo": item.URLDemo,
		"url_github": item.URLGitHub, "status": item.Status, "prioritas": item.Prioritas,
	})
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Proyek tidak ditemukan",
		})
	}
	return h.GetProject(c)
}

func (h *Handler) DeleteProject(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	err = h.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("id_proyek = ?", id).Delete(&models.TeknologiProyek{}).Error; err != nil {
			return err
		}
		result := tx.Delete(&models.Proyek{}, "id_proyek = ?", id)
		if result.Error != nil {
			return result.Error
		}
		if result.RowsAffected == 0 {
			return gorm.ErrRecordNotFound
		}
		return nil
	})
	if err == gorm.ErrRecordNotFound {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Proyek tidak ditemukan",
		})
	}
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
