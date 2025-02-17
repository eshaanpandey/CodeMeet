package routes

import (
	"server/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoomRoutes(app *fiber.App) {
	app.Post("/create-room", controllers.CreateRoom)
	app.Get("/join-room/:roomID", controllers.JoinRoom)
}
