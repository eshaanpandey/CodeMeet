package controllers

import (
	"log"
	"sync"

	"github.com/gofiber/contrib/websocket"
)

// Room tracking
var (
	roomUsers = make(map[string]map[string]*websocket.Conn) // RoomID -> (UserID -> Connection)
	videoMutex     = sync.Mutex{}
)

// WebSocket Handler for Video Calls
func VideoCallHandler(c *websocket.Conn) {
	roomID := c.Params("roomID")
	userID := c.Query("userID") // Get UserID from query params

	if userID == "" {
		log.Println("UserID is missing")
		c.Close()
		return
	}

	videoMutex.Lock()
	if roomUsers[roomID] == nil {
		roomUsers[roomID] = make(map[string]*websocket.Conn)
	}
	roomUsers[roomID][userID] = c
	videoMutex.Unlock()

	// Notify other users in the room about the new user
	broadcastVideoMessage(roomID, userID, `{"type": "new-peer", "userID": "`+userID+`"}`)

	defer func() {
		videoMutex.Lock()
		delete(roomUsers[roomID], userID)
		videoMutex.Unlock()
		c.Close()

		// Notify others that the user left
		broadcastVideoMessage(roomID, userID, `{"type": "peer-left", "userID": "`+userID+`"}`)
	}()

	for {
		_, msg, err := c.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
			break
		}

		// Forward the WebRTC signaling message to all other peers
		forwardMessage(roomID, userID, msg)
	}
}

// Send a message to all users in a room except sender
func broadcastVideoMessage(roomID, senderID, message string) {
	videoMutex.Lock()
	defer videoMutex.Unlock()
	for userID, conn := range roomUsers[roomID] {
		if userID != senderID {
			conn.WriteMessage(websocket.TextMessage, []byte(message))
		}
	}
}

// Forward messages (WebRTC SDP, ICE candidates) to other peers
func forwardMessage(roomID, senderID string, msg []byte) {
	videoMutex.Lock()
	defer videoMutex.Unlock()
	for userID, conn := range roomUsers[roomID] {
		if userID != senderID {
			err := conn.WriteMessage(websocket.TextMessage, msg)
			if err != nil {
				log.Println("Error sending message:", err)
				conn.Close()
				delete(roomUsers[roomID], userID)
			}
		}
	}
}
