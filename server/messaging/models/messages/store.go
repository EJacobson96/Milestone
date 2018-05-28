package messages

import (
	"gopkg.in/mgo.v2/bson"
)

//Store represents a store for messages
type Store interface {

	//GetByID returns the conversation with the given id
	GetByID(id bson.ObjectId) (*Conversation, error)

	//GetConversations returns every conversation based on the given userID
	GetConversations(userID bson.ObjectId) ([]*Conversation, error)

	//InsertMessage inserts new message into the database and returns the conversation
	InsertMessage(newMessage *NewMessage, userID bson.ObjectId) (*Conversation, error)

	//InsertConversation inserts a new conversation in the database and returns it
	InsertConversation(newConversation *NewConversation, userID bson.ObjectId) (*Conversation, error)
}
