package controllers

import (
	"fmt"
	"log"
	"sync"

	"server/models"

	"github.com/gofiber/contrib/websocket"
)

// Room store for tracking active connections
var (
	rooms       = make(map[string]map[*websocket.Conn]bool)
	roomClients = make(map[string]map[*websocket.Conn]string)
	mutex       = sync.Mutex{}
)

// WebSocket handler for code synchronization
func CodeEditorHandler(c *websocket.Conn) {
	roomID := c.Params("roomID")

	// Register the new client in the room
	mutex.Lock()
	if _, exists := roomClients[roomID]; !exists {
		roomClients[roomID] = make(map[*websocket.Conn]string)
	}
	roomClients[roomID][c] = "Anonymous"
	mutex.Unlock()

	defer removeClientFromRoom(roomID, c)

	for {
		var msg models.CodeSync
		if err := c.ReadJSON(&msg); err != nil {
			log.Println("Error reading JSON:", err)
			break
		}

		fmt.Printf("Received message: %+v\n", msg)

		// Broadcast message to other clients in the room
		broadcastMessage(roomID, msg, c)
	}
}

// Removes a client from the room and closes the connection
func removeClientFromRoom(roomID string, c *websocket.Conn) {
	mutex.Lock()
	defer mutex.Unlock()

	delete(roomClients[roomID], c)
	c.Close()
}

// Broadcasts a message to all other clients in the room except the sender
func broadcastMessage(roomID string, msg models.CodeSync, sender *websocket.Conn) {
	mutex.Lock()
	defer mutex.Unlock()

	for conn := range roomClients[roomID] {
		if conn != sender {
			fmt.Printf("Sending message to client in room %s\n", roomID)
			if err := conn.WriteJSON(msg); err != nil {
				fmt.Println("Error sending message:", err)
				conn.Close()
				delete(roomClients[roomID], conn)
			}
		}
	}
}
