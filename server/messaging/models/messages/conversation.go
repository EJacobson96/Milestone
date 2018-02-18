package messages

import (
	"errors"
	"time"

	"gopkg.in/mgo.v2/bson"
)

type Conversation struct {
	ID          bson.ObjectId `json:"id" bson:"_id"`
	Messages    []*Message    `json:"messages"`
	Members     []*Member
	CreatedAt   time.Time `json:"createdAt"`
	LastMessage time.Time `json:"lastMessage"`
}

type NewConversation struct {
	Message *NewMessage `json:"message"`
	Members []*Member   `json:"members"`
}

type Member struct {
	ID       bson.ObjectId `json:"id" bson:"_id"`
	FullName string        `json:"fullName"`
}

//validates a new conversation
func (nc *NewConversation) Validate() error {
	if nc.Message == nil {
		return errors.New("error: no message found")
	}
	if len(nc.Members) < 2 {
		return errors.New("error: less than 2 members in conversation")
	}
	return nil
}

func (nc *NewConversation) ToConversation() (*Conversation, error) {
	conversation := &Conversation{
		Members:     nc.Members,
		CreatedAt:   time.Now(),
		LastMessage: time.Now(),
	}
	return conversation, nil
}
