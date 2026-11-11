package handlers

import (
	"strings"

	"bem-portfolio/backend/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func certificateFromInput(in models.PermintaanSertifikasi) (models.Sertifikasi, error) {
	in.NamaSertifikat, in.Penerbit = strings.TrimSpace(in.NamaSertifikat), strings.TrimSpace(in.Penerbit)
	if in.NamaSertifikat == "" || in.Penerbit == "" {
		return models.Sertifikasi{}, fiber.NewError(400, "Nama sertifikat dan penerbit wajib diisi")
	}
	issue, err := parseDate(in.TanggalTerbit, true)
	if err != nil {
		return models.Sertifikasi{}, fiber.NewError(400, "Tanggal terbit harus YYYY-MM-DD")
	}
	expiry, err := parseDate(in.TanggalKadaluarsa, true)
	if err != nil {
		return models.Sertifikasi{}, fiber.NewError(400, "Tanggal kadaluarsa harus YYYY-MM-DD")
	}
	if issue != nil && expiry != nil && expiry.Before(*issue) {
		return models.Sertifikasi{}, fiber.NewError(400, "Tanggal kadaluarsa tidak boleh sebelum tanggal terbit")
	}
	if !validURL(in.URLSertifikat) {
		return models.Sertifikasi{}, fiber.NewError(400, "URL sertifikat harus HTTP atau HTTPS")
	}
	return models.Sertifikasi{NamaSertifikat: in.NamaSertifikat, Penerbit: in.Penerbit, TanggalTerbit: issue, TanggalKadaluarsa: expiry, NomorSertifikat: in.NomorSertifikat, URLSertifikat: in.URLSertifikat, Deskripsi: in.Deskripsi, UrutanTampil: in.UrutanTampil}, nil
}

func (h *Handler) ListCertificates(c *fiber.Ctx) error {
	page, limit, err := pagination(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var items []models.Sertifikasi
	var total int64
	if err := h.DB.Model(&models.Sertifikasi{}).Count(&total).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if err := h.DB.Order("sort_order ASC").Order("tanggal_terbit DESC").Offset((page - 1) * limit).Limit(limit).Find(&items).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return c.JSON(pageResult(items, page, limit, total))
}

func (h *Handler) CreateCertificate(c *fiber.Ctx) error {
	var input models.PermintaanSertifikasi
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
	}
	item, err := certificateFromInput(input)
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

func (h *Handler) GetCertificate(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var item models.Sertifikasi
	if err := h.DB.First(&item, "id_sertifikasi = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Sertifikasi tidak ditemukan",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	return c.JSON(item)
}

func (h *Handler) UpdateCertificate(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var input models.PermintaanSertifikasi
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body JSON tidak valid",
		})
	}
	item, err := certificateFromInput(input)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	result := h.DB.Model(&models.Sertifikasi{}).Where("id_sertifikasi = ?", id).Updates(map[string]any{
		"nama_sertifikat": item.NamaSertifikat, "penerbit": item.Penerbit, "tanggal_terbit": item.TanggalTerbit,
		"tanggal_kadaluarsa": item.TanggalKadaluarsa, "nomor_sertifikat": item.NomorSertifikat,
		"url_sertifikat": item.URLSertifikat, "deskripsi": item.Deskripsi, "sort_order": item.UrutanTampil,
	})
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Sertifikasi tidak ditemukan",
		})
	}
	return h.GetCertificate(c)
}

func (h *Handler) DeleteCertificate(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	result := h.DB.Delete(&models.Sertifikasi{}, "id_sertifikasi = ?", id)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Terjadi kesalahan pada server",
		})
	}
	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Sertifikasi tidak ditemukan",
		})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
