package routes

import (
	"server/controllers"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

func SetupCodeRoutes(app *fiber.App) {
	app.Use("/ws/", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/ws/code/:roomID", websocket.New(controllers.CodeEditorHandler))
}
