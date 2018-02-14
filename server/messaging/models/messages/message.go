package messages

import (
	"errors"
	"time"

	"gopkg.in/mgo.v2/bson"
)

type Message struct {
	ID             bson.ObjectId
	ConversationID bson.ObjectId
	Creator        string
	TextBody       string
	CreatedAt      time.Time
}

type NewMessage struct {
	ConversationID bson.ObjectId
	TextBody       string
}

func (nm *NewMessage) Validate() error {
	if len(nm.TextBody) == 0 {
		return errors.New("error: no message in textbody")
	}
	if len(nm.ConversationID) == 0 {
		return errors.New("error: no conversation defined")
	}
	return nil
}

func (nm *NewMessage) ToMessage(userEmail string) (*Message, error) {
	return &Message{
		ConversationID: nm.ConversationID,
		Creator:        userEmail,
		TextBody:       nm.TextBody,
		CreatedAt:      time.Now(),
	}, nil
}
