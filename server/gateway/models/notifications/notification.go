package notifications

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

type Notification struct {
	TimeSent    time.Time       `json:"timeSent"`
	Read        bool            `json:"read"`
	Body        string          `json:"body"`
	ContentType string          `json:"contentType"`
	ContentID   bson.ObjectId   `json:"contentID"`
	Users       []bson.ObjectId `json:"users"`
}

type Request struct {
	TimeSent    time.Time     `json:"timeSent"`
	Type        string        `json:"type"`
	Body        string        `json:"body"`
	FullName    string        `json:"fullName"`
	Email       string        `json:"email"`
	User        bson.ObjectId `json:"user"`
	ContentType string        `json:"contentType"`
	// ContentID   bson.ObjectId `json:"contentID"`
}
