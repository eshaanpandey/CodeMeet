package controllers

import (
	"context"
	"time"

	"server/config"
	"server/models"
	"server/utils"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

// CreateRoom generates a new unique room ID and stores it in MongoDB
func CreateRoom(c *fiber.Ctx) error {
	roomID := utils.GenerateRandomID()
	room := models.Room{
		RoomID:    roomID,
		CreatedAt: time.Now(),
	}

	collection := config.GetCollection("rooms")
	_, err := collection.InsertOne(context.TODO(), room)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create room"})
	}

	return c.JSON(fiber.Map{"room_id": roomID})
}

// JoinRoom validates whether a room exists in MongoDB
func JoinRoom(c *fiber.Ctx) error {
	roomID := c.Params("roomID")
	collection := config.GetCollection("rooms")

	var room models.Room
	err := collection.FindOne(context.TODO(), bson.M{"room_id": roomID}).Decode(&room)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Room not found"})
	}

	return c.JSON(fiber.Map{"message": "Room exists"})
}