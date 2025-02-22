package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"

	"server/config"
	"server/controllers"
	"server/routes"
)

func main() {
	// Load environment variables
	if os.Getenv("RENDER") == "" { // Render sets this env var in production
		if err := godotenv.Load(); err != nil {
			log.Println("Warning: No .env file found, using system environment variables")
		}
	}

	// Connect to Database
	config.ConnectDB()

	// Create Fiber app
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", 
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	app.Use("/ws/", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/ws/chat/:roomID", websocket.New(controllers.ChatHandler))
	app.Use("/ws/video/:roomID", websocket.New(controllers.VideoCallHandler))

	routes.SetupAuthRoutes(app)
	routes.SetupCodeRoutes(app)
	routes.SetupRoomRoutes(app)

	// Get port from .env or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if not specified
	}

	// Log the port number
	fmt.Printf("Server is running on port %s\n", port)

	// Start Server
	log.Fatal(app.Listen(":" + port))
}
