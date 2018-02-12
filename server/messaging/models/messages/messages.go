package messages

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

type Message struct {
	ConversationID bson.ObjectId
	TextBody       string
	Author         string
	CreatedAt      time.Time
}

type Conversation struct {
	Messages  []*Message
	People    []string
	CreatedAt time.Time
}
