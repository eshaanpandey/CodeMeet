package controllers

import (
	"fmt"
	"log"
	"sync"

	"server/models"
	"encoding/json"

	"github.com/gofiber/contrib/websocket"
)

// Room store for tracking active connections
var (
	rooms       = make(map[string]map[*websocket.Conn]bool)
	roomClients = make(map[string]map[*websocket.Conn]string)
	userRooms  = make(map[string]map[*websocket.Conn]string)
	codeMutex       = sync.Mutex{}
	userMutex       = sync.Mutex{}
)

func mapToStruct(input map[string]interface{}, output interface{}) error {
	bytes, err := json.Marshal(input) // Convert map to JSON
	if err != nil {
		return fmt.Errorf("error marshaling: %v", err)
	}

	err = json.Unmarshal(bytes, output) // Convert JSON to struct
	if err != nil {
		return fmt.Errorf("error unmarshaling: %v", err)
	}
	return nil
}

// WebSocket handler for code synchronization
func CodeEditorHandler(c *websocket.Conn) {
	roomID := c.Params("roomID")

	// Register the new client in the room
	codeMutex.Lock()
	if _, exists := roomClients[roomID]; !exists {
		roomClients[roomID] = make(map[*websocket.Conn]string)
	}
	roomClients[roomID][c] = "Anonymous"
	codeMutex.Unlock()

	// Register user in userRooms
	userMutex.Lock()
	if _, exists := userRooms[roomID]; !exists {
		userRooms[roomID] = make(map[*websocket.Conn]string)
	}
	userRooms[roomID][c] = "Anonymous" // Use username if available
	userMutex.Unlock()
	broadcastUserList(roomID)

	defer removeClientFromRoom(roomID, c)

	for {
		var msg map[string]interface{}
		if err := c.ReadJSON(&msg); err != nil {
			log.Println("Error reading JSON:", err)
			break
		}

		// Handle join messages
		if msg["type"] == "join" {
			username, ok := msg["username"].(string)
			if ok {
				userMutex.Lock()
				userRooms[roomID][c] = username
				userMutex.Unlock()

				broadcastUserList(roomID)
			}
			continue
		}

		// Handle code messages
		var codeMsg models.CodeSync
		if err := mapToStruct(msg, &codeMsg); err == nil {
			broadcastCodeMessage(roomID, codeMsg, c)
		}
	}
}

// Removes a client from the room and closes the connection
func removeClientFromRoom(roomID string, c *websocket.Conn) {
	codeMutex.Lock()
	delete(roomClients[roomID], c)
	codeMutex.Unlock()

	userMutex.Lock()
	delete(userRooms[roomID], c) 
	userMutex.Unlock()

	c.Close()

	broadcastUserList(roomID)
}

// Broadcasts a message to all other clients in the room except the sender
func broadcastCodeMessage(roomID string, msg models.CodeSync, sender *websocket.Conn) {
	codeMutex.Lock()
	defer codeMutex.Unlock()

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

// Broadcast updated user list
func broadcastUserList(roomID string) {
	userMutex.Lock()
	defer userMutex.Unlock()

	users := []string{}
	for _, username := range userRooms[roomID] {
		users = append(users, username)
	}

	for conn := range userRooms[roomID] {
		err := conn.WriteJSON(map[string]interface{}{
			"type":  "users",
			"users": users,
		})
		if err != nil {
			fmt.Println("Error sending user list:", err)
			conn.Close()
			delete(userRooms[roomID], conn)
		}
	}
}