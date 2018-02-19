package messages

import (
	"errors"
	"time"

	"gopkg.in/mgo.v2/bson"
)

type Message struct {
	ID             bson.ObjectId `json:"id" bson:"_id"`
	ConversationID bson.ObjectId `json:"conversationID"`
	Creator        bson.ObjectId `json:"creator"`
	TextBody       string        `json:"textBody"`
	CreatedAt      time.Time     `json:"createdAt"`
}

type NewMessage struct {
	ConversationID bson.ObjectId `json:"id" bson:"_id"`
	TextBody       string        `json:"textBody"`
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

func (nm *NewMessage) ToMessage(userID bson.ObjectId) (*Message, error) {
	return &Message{
		ConversationID: nm.ConversationID,
		Creator:        userID,
		TextBody:       nm.TextBody,
		CreatedAt:      time.Now(),
	}, nil
}
