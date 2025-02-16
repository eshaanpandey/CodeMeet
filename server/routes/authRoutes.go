package routes

import (
	"github.com/gofiber/fiber/v2"
	"server/controllers"
	"server/middleware"
)

func SetupAuthRoutes(app *fiber.App) {
	auth := app.Group("/api/auth")
	auth.Post("/signup", controllers.SignUp)
	auth.Post("/login", controllers.Login)

	// Protected route (example)
	auth.Get("/profile", middleware.AuthMiddleware, func(c *fiber.Ctx) error {
		userEmail := c.Locals("userEmail").(string)
		return c.JSON(fiber.Map{"message": "Welcome!", "email": userEmail})
	})
}
