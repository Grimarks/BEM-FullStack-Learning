package handlers

import (
	"strconv"
	"strings"

	"bem-portfolio/backend/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func teknologiDariInput(db *gorm.DB, in models.PermintaanTeknologi) (models.Teknologi, error) {
	in.NamaTeknologi = strings.TrimSpace(in.NamaTeknologi)
	if in.NamaTeknologi == "" {
		return models.Teknologi{}, fiber.NewError(400, "Nama teknologi wajib diisi")
	}
	if in.IDIkon != nil {
		var icon models.Ikon
		if err := db.First(&icon, "id_ikon = ?", *in.IDIkon).Error; err != nil {
			return models.Teknologi{}, fiber.NewError(400, "Ikon tidak ditemukan")
		}
	}
	return models.Teknologi{NamaTeknologi: in.NamaTeknologi, IDIkon: in.IDIkon}, nil
}
func (h *Handler) ListTeknologi(c *fiber.Ctx) error {
	var items []models.Teknologi
	if err := h.DB.Preload("Ikon").Order("nama_teknologi ASC").Find(&items).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return c.JSON(fiber.Map{
		"data": items,
	})
}
func (h *Handler) CreateTeknologi(c *fiber.Ctx) error {
	var input models.PermintaanTeknologi
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
	}
	item, err := teknologiDariInput(h.DB, input)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	if err := h.DB.Create(&item).Error; err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Nama teknologi sudah digunakan",
		})
	}
	return c.Status(201).JSON(item)
}
func (h *Handler) GetTeknologi(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var item models.Teknologi
	if err := h.DB.Preload("Ikon").First(&item, "id_teknologi = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Teknologi tidak ditemukan",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return c.JSON(item)
}
func (h *Handler) UpdateTeknologi(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var input models.PermintaanTeknologi
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
	}
	item, err := teknologiDariInput(h.DB, input)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	res := h.DB.Model(&models.Teknologi{}).Where("id_teknologi = ?", id).Updates(map[string]any{"nama_teknologi": item.NamaTeknologi, "id_ikon": item.IDIkon})
	if res.Error != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Nama teknologi sudah digunakan",
		})
	}
	if res.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Teknologi tidak ditemukan",
		})
	}
	return h.GetTeknologi(c)
}
func (h *Handler) DeleteTeknologi(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var count int64
	if err := h.DB.Model(&models.TeknologiProyek{}).Where("id_teknologi = ?", id).Count(&count).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if count > 0 {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Teknologi masih terhubung ke proyek",
		})
	}
	if err := h.DB.Model(&models.TeknologiProfil{}).Where("id_teknologi = ?", id).Count(&count).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if count > 0 {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Teknologi masih dipilih pada profil",
		})
	}
	res := h.DB.Delete(&models.Teknologi{}, "id_teknologi = ?", id)
	if res.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if res.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Teknologi tidak ditemukan",
		})
	}
	return c.SendStatus(204)
}

func (h *Handler) ListProjectTechnologies(c *fiber.Ctx) error {
	projectID, err := parsePathID(c, "projectId")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var project models.Proyek
	if err := h.DB.First(&project, "id_proyek = ?", projectID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Proyek tidak ditemukan",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	var rows []models.TeknologiProyek
	if err := h.DB.Preload("Teknologi.Ikon").Where("id_proyek = ?", projectID).Order("id_teknologi_proyek ASC").Find(&rows).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return c.JSON(fiber.Map{
		"data": rows,
	})
}
func (h *Handler) AddProjectTechnology(c *fiber.Ctx) error {
	projectID, err := parsePathID(c, "projectId")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var input models.PermintaanTeknologiProyek
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
	}
	if input.IDTeknologi == 0 || strings.TrimSpace(input.Kategori) == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Teknologi dan kategori wajib diisi",
		})
	}
	var p models.Proyek
	if err := h.DB.First(&p, "id_proyek = ?", projectID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Proyek tidak ditemukan",
		})
	}
	var t models.Teknologi
	if err := h.DB.First(&t, "id_teknologi = ?", input.IDTeknologi).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Teknologi tidak ditemukan",
		})
	}
	link := models.TeknologiProyek{IDProyek: projectID, IDTeknologi: input.IDTeknologi, Kategori: strings.TrimSpace(input.Kategori)}
	if err := h.DB.Create(&link).Error; err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Teknologi sudah terhubung ke proyek",
		})
	}
	return c.Status(201).JSON(link)
}
func (h *Handler) UpdateProjectTechnology(c *fiber.Ctx) error {
	projectID, err := parsePathID(c, "projectId")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	technologyID, err := parsePathID(c, "technologyId")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var input models.PermintaanTeknologiProyek
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
	}
	category := strings.TrimSpace(input.Kategori)
	if category == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Kategori wajib diisi",
		})
	}
	res := h.DB.Model(&models.TeknologiProyek{}).Where("id_proyek = ? AND id_teknologi = ?", projectID, technologyID).Update("kategori", category)
	if res.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if res.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Relasi teknologi proyek tidak ditemukan",
		})
	}
	return c.JSON(fiber.Map{
		"id_proyek":    projectID,
		"id_teknologi": technologyID,
		"kategori":     category,
	})
}
func (h *Handler) RemoveProjectTechnology(c *fiber.Ctx) error {
	projectID, err := parsePathID(c, "projectId")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	technologyID, err := parsePathID(c, "technologyId")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	res := h.DB.Where("id_proyek = ? AND id_teknologi = ?", projectID, technologyID).Delete(&models.TeknologiProyek{})
	if res.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if res.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Relasi teknologi proyek tidak ditemukan",
		})
	}
	return c.SendStatus(204)
}

func (h *Handler) ListProfileTechnologies(c *fiber.Ctx) error {
	var rows []models.TeknologiProfil
	if err := h.DB.Preload("Teknologi.Ikon").Order("prioritas ASC").Order("id_teknologi_profil ASC").Find(&rows).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return c.JSON(fiber.Map{
		"data": rows,
	})
}
func (h *Handler) AddProfileTechnology(c *fiber.Ctx) error {
	var input models.PermintaanTeknologiProfil
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
	}
	if input.IDTeknologi == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Teknologi wajib dipilih",
		})
	}
	var t models.Teknologi
	if err := h.DB.First(&t, "id_teknologi = ?", input.IDTeknologi).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Teknologi tidak ditemukan",
		})
	}
	row := models.TeknologiProfil{IDTeknologi: input.IDTeknologi, Prioritas: input.Prioritas}
	if err := h.DB.Create(&row).Error; err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Teknologi sudah tampil pada profil",
		})
	}
	return c.Status(201).JSON(row)
}
func (h *Handler) UpdateProfileTechnology(c *fiber.Ctx) error {
	id, err := parsePathID(c, "technologyId")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var input models.PermintaanTeknologiProfil
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
	}
	res := h.DB.Model(&models.TeknologiProfil{}).Where("id_teknologi = ?", id).Update("prioritas", input.Prioritas)
	if res.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if res.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Teknologi profil tidak ditemukan",
		})
	}
	return c.JSON(fiber.Map{
		"id_teknologi": id,
		"prioritas":    input.Prioritas,
	})
}
func (h *Handler) RemoveProfileTechnology(c *fiber.Ctx) error {
	id, err := parsePathID(c, "technologyId")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	res := h.DB.Delete(&models.TeknologiProfil{}, "id_teknologi = ?", id)
	if res.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if res.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Teknologi profil tidak ditemukan",
		})
	}
	return c.SendStatus(204)
}

func parsePathID(c *fiber.Ctx, key string) (uint, error) {
	value, err := strconv.ParseUint(c.Params(key), 10, 32)
	if err != nil || value == 0 {
		return 0, fiber.NewError(400, "ID tidak valid")
	}
	return uint(value), nil
}
