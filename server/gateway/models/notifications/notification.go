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
	Count       int             `json:"count"`
	Users       []bson.ObjectId `json:"users"`
}

type Request struct {
	TimeSent    time.Time     `json:"timeSent"`
	Body        string        `json:"body"`
	User        bson.ObjectId `json:"user"`
	ContentType string        `json:"contentType"`
}
