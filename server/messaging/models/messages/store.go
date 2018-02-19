package messages

import (
	"gopkg.in/mgo.v2/bson"
)

//Store represents a store for messages
type Store interface {

	//GetAllUsers returns every single user
	GetConversations(name string, userID bson.ObjectId) ([]*Conversation, error)

	//InsertMessage inserts new message into the database, and returns it
	InsertMessage(newMessage *NewMessage, userID bson.ObjectId) ([]*Message, error)

	//InsertMemberToConversation inserts a new member in a conversation
	RemoveMemberFromConversation(removeMember *Member, coversationID bson.ObjectId) ([]*Member, error)

	//Update applies UserUpdates to the given user ID
	InsertConversation(newConversation *NewConversation, userID bson.ObjectId) (*Conversation, error)
}
