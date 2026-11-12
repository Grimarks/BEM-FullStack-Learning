package handlers

import (
	"net/url"
	"strconv"
	"strings"

	"bem-portfolio/backend/config"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type Handler struct {
	DB  *gorm.DB
	Cfg config.Config
}

func parseID(c *fiber.Ctx) (uint, error) {
	id, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil || id == 0 {
		return 0, fiber.NewError(fiber.StatusBadRequest, "ID tidak valid")
	}
	return uint(id), nil
}

func pagination(c *fiber.Ctx) (int, int, error) {
	page, err := parsePositiveQuery(c, "page", 1)
	if err != nil {
		return 0, 0, err
	}
	if page > 1_000_000 {
		return 0, 0, fiber.NewError(fiber.StatusBadRequest, "page terlalu besar")
	}
	limit, err := parsePositiveQuery(c, "limit", 10)
	if err != nil {
		return 0, 0, err
	}
	if limit > 50 {
		limit = 50
	}
	return page, limit, nil
}

func parsePositiveQuery(c *fiber.Ctx, key string, fallback int) (int, error) {
	raw := c.Query(key)
	if raw == "" {
		return fallback, nil
	}
	n, err := strconv.Atoi(raw)
	if err != nil || n < 1 {
		return 0, fiber.NewError(fiber.StatusBadRequest, key+" harus integer positif")
	}
	return n, nil
}

func validURL(raw string) bool {
	if raw == "" {
		return true
	}
	if len(raw) > 2048 {
		return false
	}
	u, err := url.ParseRequestURI(raw)
	return err == nil && (u.Scheme == "https" || u.Scheme == "http") && u.Host != ""
}

func validLink(raw string) bool {
	if raw == "" || validURL(raw) {
		return true
	}
	if len(raw) > 2048 || strings.ContainsAny(raw, " \t\r\n") {
		return false
	}
	if strings.HasPrefix(raw, "#") {
		return len(raw) > 1
	}
	if strings.HasPrefix(raw, "/") && !strings.HasPrefix(raw, "//") {
		return !strings.Contains(raw, "..")
	}
	if email, ok := strings.CutPrefix(raw, "mailto:"); ok {
		address, err := mail.ParseAddress(email)
		return err == nil && address.Address == email
	}
	return false
}

func validImagePath(raw string) bool {
	return raw == "" || (len(raw) <= 2048 && strings.HasPrefix(raw, "/uploads/") && !strings.Contains(raw, "..")) || validURL(raw)
}
