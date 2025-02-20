package controllers

import (
	// "context"
	// "time"

	// "server/config"
	// "server/models"
	// "server/utils"

	// "github.com/gofiber/fiber/v2"
	// "go.mongodb.org/mongo-driver/bson"

	"fmt"
	"log"
	"sync"

	"github.com/gofiber/contrib/websocket"
)

var (
	chatRooms   = make(map[string]map[*websocket.Conn]string) // Stores users in rooms
	chatMutex   = sync.Mutex{}
)
// Chat WebSocket Handler
func ChatHandler(c *websocket.Conn) {
	roomID := c.Params("roomID")
	username := c.Query("username") // Get username from query

	chatMutex.Lock()
	if _, exists := chatRooms[roomID]; !exists {
		chatRooms[roomID] = make(map[*websocket.Conn]string)
	}
	chatRooms[roomID][c] = username
	chatMutex.Unlock()

	defer removeChatClient(roomID, c)

	for {
		var msg struct {
			Message string `json:"message"`
		}

		if err := c.ReadJSON(&msg); err != nil {
			log.Println("Error reading chat message:", err)
			break
		}

		fmt.Printf("[%s] %s: %s\n", roomID, username, msg.Message)

		// Broadcast to all users in the room
		broadcastChatMessage(roomID, username, msg.Message, c)
	}
}

// Remove disconnected user from chat room
func removeChatClient(roomID string, c *websocket.Conn) {
	chatMutex.Lock()
	defer chatMutex.Unlock()
	delete(chatRooms[roomID], c)
	c.Close()
}

// Broadcast chat message to all users in the room
func broadcastChatMessage(roomID, username, message string, sender *websocket.Conn) {
	chatMutex.Lock()
	defer chatMutex.Unlock()

	for conn := range chatRooms[roomID] {
		// if conn != sender {
			err := conn.WriteJSON(map[string]string{
				"username": username,
				"message":  message,
			})
			if err != nil {
				fmt.Println("Error sending chat message:", err)
				conn.Close()
				delete(chatRooms[roomID], conn)
			}
		// }
	}
}