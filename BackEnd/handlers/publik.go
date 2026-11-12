package handlers

import (
	"bem-portfolio/backend/models"
	"github.com/gofiber/fiber/v2"
)

func (h *Handler) PublicPortfolio(c *fiber.Ctx) error {
	var content models.KontenWebsite
	var profile models.Profil
	var experiences []models.Perjalanan
	var projects []models.Proyek
	var certificates []models.Sertifikasi
	var socials []models.MediaSosial
	var profileTechnologies []models.TeknologiProfil
	if err := h.DB.First(&content, 1).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if err := h.DB.First(&profile, 1).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if err := h.DB.Order("sort_order ASC").Order("tanggal_mulai DESC").Find(&experiences).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if err := h.DB.Order("prioritas ASC").Order("tanggal DESC").Order("id_proyek ASC").Find(&projects).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if err := h.DB.Order("sort_order ASC").Order("tanggal_terbit DESC").Find(&certificates).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if err := h.DB.Preload("Ikon").Order("sort_order ASC").Order("id_media_sosial ASC").Find(&socials).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if err := h.DB.Preload("Teknologi.Ikon").Order("prioritas ASC").Order("id_teknologi_profil ASC").Find(&profileTechnologies).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	projectTechnologies := make(map[uint][]models.TeknologiProyek, len(projects))
	for _, project := range projects {
		var links []models.TeknologiProyek
		if err := h.DB.Preload("Teknologi.Ikon").Where("id_proyek = ?", project.IDProyek).Order("id_teknologi_proyek ASC").Find(&links).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Terjadi kesalahan pada server",
			})
		}
		projectTechnologies[project.IDProyek] = links
	}
	type publicProject struct {
		Proyek       models.Proyek            `json:"project"`
		Technologies []models.TeknologiProyek `json:"technologies"`
	}
	projectData := make([]publicProject, 0, len(projects))
	for _, project := range projects {
		projectData = append(projectData, publicProject{Proyek: project, Technologies: projectTechnologies[project.IDProyek]})
	}
	return c.JSON(fiber.Map{
		"website_content": content,
		"profile":         fiber.Map{"profile": profile, "technologies": profileTechnologies},
		"experiences":     experiences,
		"projects":        projectData,
		"certificates":    certificates,
		"social_links":    socials,
	})
}

func (h *Handler) Dashboard(c *fiber.Ctx) error {
	counts := map[string]int64{}
	for name, model := range map[string]any{"experiences": &models.Perjalanan{}, "projects": &models.Proyek{}, "certificates": &models.Sertifikasi{}, "social_links": &models.MediaSosial{}} {
		var count int64
		if err := h.DB.Model(model).Count(&count).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Terjadi kesalahan pada server",
			})
		}
		counts[name] = count
	}
	return c.JSON(counts)
}
