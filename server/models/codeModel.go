package models

import (
	"time"
)

type CodeSync struct {
	RoomID    string    `json:"room_id"`
	Username  string    `json:"username"`
	Content   string    `json:"content"`
	CursorPos    int       `json:"cursorPos"`
	SelectionFrom int      `json:"selectionFrom"`
	SelectionTo   int      `json:"selectionTo"`
	Timestamp time.Time `json:"timestamp"`
}