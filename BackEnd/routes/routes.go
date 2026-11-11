package routes

import (
	"bem-portfolio/backend/handlers"
	"bem-portfolio/backend/middleware"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Register(app *fiber.App, h *handlers.Handler, db *gorm.DB) {
	api := app.Group("/api")
	auth := api.Group("/auth")
	auth.Post("/login", h.Login)
	auth.Post("/logout", middleware.Session(db), h.Logout)
	auth.Get("/me", middleware.Session(db), h.Me)
	auth.Put("/password", middleware.Session(db), h.ChangePassword)

	api.Get("/public/portfolio", h.PublicPortfolio)
	admin := api.Group("/admin", middleware.Session(db))
	admin.Get("/dashboard", h.Dashboard)
	admin.Get("/content", h.GetContent)
	admin.Put("/content", h.UpdateContent)
	admin.Get("/profile", h.GetProfile)
	admin.Put("/profile", h.UpdateProfile)

	perjalanan := admin.Group("/experiences")
	perjalanan.Get("/", h.ListExperiences)
	perjalanan.Post("/", h.CreateExperience)
	perjalanan.Get("/:id", h.GetExperience)
	perjalanan.Put("/:id", h.UpdateExperience)
	perjalanan.Delete("/:id", h.DeleteExperience)

	proyek := admin.Group("/projects")
	proyek.Get("/", h.ListProjects)
	proyek.Post("/", h.CreateProject)
	proyek.Get("/:id", h.GetProject)
	proyek.Put("/:id", h.UpdateProject)
	proyek.Delete("/:id", h.DeleteProject)
	proyek.Get("/:projectId/technologies", h.ListProjectTechnologies)
	proyek.Post("/:projectId/technologies", h.AddProjectTechnology)
	proyek.Put("/:projectId/technologies/:technologyId", h.UpdateProjectTechnology)
	proyek.Delete("/:projectId/technologies/:technologyId", h.RemoveProjectTechnology)

	sertifikasi := admin.Group("/certificates")
	sertifikasi.Get("/", h.ListCertificates)
	sertifikasi.Post("/", h.CreateCertificate)
	sertifikasi.Get("/:id", h.GetCertificate)
	sertifikasi.Put("/:id", h.UpdateCertificate)
	sertifikasi.Delete("/:id", h.DeleteCertificate)

	mediaSosial := admin.Group("/social-links")
	mediaSosial.Get("/", h.ListMediaSosial)
	mediaSosial.Post("/", h.CreateMediaSosial)
	mediaSosial.Get("/:id", h.GetMediaSosial)
	mediaSosial.Put("/:id", h.UpdateMediaSosial)
	mediaSosial.Delete("/:id", h.DeleteMediaSosial)

	ikon := admin.Group("/icons")
	ikon.Get("/", h.ListIkon)
	ikon.Post("/", h.CreateIkon)
	ikon.Get("/:id", h.GetIkon)
	ikon.Put("/:id", h.UpdateIkon)
	ikon.Delete("/:id", h.DeleteIkon)

	teknologi := admin.Group("/technologies")
	teknologi.Get("/", h.ListTeknologi)
	teknologi.Post("/", h.CreateTeknologi)
	teknologi.Get("/:id", h.GetTeknologi)
	teknologi.Put("/:id", h.UpdateTeknologi)
	teknologi.Delete("/:id", h.DeleteTeknologi)

	teknologiProfil := admin.Group("/profile/technologies")
	teknologiProfil.Get("/", h.ListProfileTechnologies)
	teknologiProfil.Post("/", h.AddProfileTechnology)
	teknologiProfil.Put("/:technologyId", h.UpdateProfileTechnology)
	teknologiProfil.Delete("/:technologyId", h.RemoveProfileTechnology)

	admin.Post("/uploads", h.Upload)
}
