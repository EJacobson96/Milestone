package messages

import (
	"gopkg.in/mgo.v2/bson"
)

//Store represents a store for messages
type Store interface {

	//GetByID returns the conversation with the given id
	GetByID(id bson.ObjectId) (*Conversation, error)

	//GetAllUsers returns every single user
	GetConversations(userID bson.ObjectId) ([]*Conversation, error)

	//InsertMessage inserts new message into the database, and returns it
	InsertMessage(newMessage *NewMessage, userID bson.ObjectId) (*Conversation, error)

	//Update applies UserUpdates to the given user ID
	InsertConversation(newConversation *NewConversation, userID bson.ObjectId) (*Conversation, error)
}
