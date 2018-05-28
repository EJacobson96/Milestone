package messages

import (
	"errors"
	"time"

	"gopkg.in/mgo.v2/bson"
)

//Represents a conversation in the database
type Conversation struct {
	ID          bson.ObjectId `json:"id" bson:"_id"`
	Messages    []*Message    `json:"messages"`
	Members     []*Member     `json:"members"`
	CreatedAt   time.Time     `json:"createdAt"`
	LastMessage time.Time     `json:"lastMessage"`
}

//Represents a NewConversation that converts to a conversation
type NewConversation struct {
	Message *NewMessage `json:"message"`
	Members []*Member   `json:"members"`
}

//Represents a user involved in a conversation
type Member struct {
	ID       bson.ObjectId `json:"id" bson:"_id"`
	FullName string        `json:"fullName"`
}

//Validate validates a new conversation
func (nc *NewConversation) Validate() error {
	if nc.Message == nil {
		return errors.New("error: no message found")
	}
	if len(nc.Members) < 2 {
		return errors.New("error: less than 2 members in conversation")
	}
	return nil
}

//ToConversation conversations a new conversation to a conversation
func (nc *NewConversation) ToConversation() (*Conversation, error) {
	return &Conversation{
		Members:     nc.Members,
		CreatedAt:   time.Now(),
		LastMessage: time.Now(),
	}, nil
}
