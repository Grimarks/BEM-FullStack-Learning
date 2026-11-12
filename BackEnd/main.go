package main

import (
	"errors"
	"fmt"
	"log"
	"os"

	"bem-portfolio/backend/config"
	"bem-portfolio/backend/database"
	"bem-portfolio/backend/handlers"
	"bem-portfolio/backend/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}
	if err := os.MkdirAll(cfg.UploadDir, 0750); err != nil {
		log.Fatalf("buat direktori upload: %v", err)
	}
	db, err := database.Open(cfg)
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		sqlDB, err := db.DB()
		if err == nil {
			_ = sqlDB.Close()
		}
	}()

	app := fiber.New(fiber.Config{
		BodyLimit: int(cfg.MaxUploadBytes) + 1024*1024,
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			errorCode := "internal_error"
			var fiberErr *fiber.Error
			if errors.As(err, &fiberErr) {
				code = fiberErr.Code
				errorCode = "request_error"
			}
			message := "Terjadi kesalahan pada server"
			if code < 500 {
				message = err.Error()
			}
			return c.Status(code).JSON(fiber.Map{
				"error":   errorCode,
				"message": message,
			})
		},
	})
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.FrontendOrigin,
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept",
		AllowCredentials: true,
		MaxAge:           300,
	}))
	app.Static("/uploads", cfg.UploadDir, fiber.Static{Browse: false, Compress: true, ByteRange: true})
	h := &handlers.Handler{
		DB:  db,
		Cfg: cfg,
	}
	routes.Register(app, h, db)
	app.Get("/swagger", func(c *fiber.Ctx) error {
		return c.SendFile("docs/swagger.html")
	})
	app.Get("/swagger/openapi.yaml", func(c *fiber.Ctx) error {
		return c.SendFile("docs/openapi.yaml")
	})
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "ok",
		})
	})

	address := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("Backend berjalan di http://localhost%s", address)
	log.Fatal(app.Listen(address))
}
