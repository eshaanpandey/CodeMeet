package controllers

import (
	"log"
	// "sync"

	"github.com/gofiber/contrib/websocket"
)

// var rooms = make(map[string]map[*websocket.Conn]bool)
// var mutex = sync.Mutex{}

func VideoCallHandler(c *websocket.Conn) {
	roomID := c.Params("roomID")

	mutex.Lock()
	if rooms[roomID] == nil {
		rooms[roomID] = make(map[*websocket.Conn]bool)
	}
	rooms[roomID][c] = true
	mutex.Unlock()

	defer func() {
		mutex.Lock()
		delete(rooms[roomID], c)
		mutex.Unlock()
		c.Close()
	}()

	for conn := range rooms[roomID] {
		if conn != c {
			conn.WriteMessage(websocket.TextMessage, []byte(`{"type": "new-peer"}`))
		}
	}

	for {
		_, msg, err := c.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
			break
		}

		mutex.Lock()
		for conn := range rooms[roomID] {
			if conn != c {
				err = conn.WriteMessage(websocket.TextMessage, msg)
				if err != nil {
					log.Println("Write error:", err)
					conn.Close()
					delete(rooms[roomID], conn)
				}
			}
		}
		mutex.Unlock()
	}
}
