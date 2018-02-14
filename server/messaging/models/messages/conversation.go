package messages

import (
	"errors"
	"time"

	"gopkg.in/mgo.v2/bson"
)

type Conversation struct {
	ID        bson.ObjectId
	Messages  []*Message
	Members   []string
	CreatedAt time.Time
}

type NewConversation struct {
	Message *NewMessage
	Members []string
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

func (nc *NewConversation) ToConversation(email string) (*Conversation, error) {
	conversation := &Conversation{
		Members:   nc.Members,
		CreatedAt: time.Now(),
	}
	return conversation, nil
}
