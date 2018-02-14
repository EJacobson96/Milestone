package messages

//Store represents a store for messages
type Store interface {

	//GetAllUsers returns every single user
	GetConversations(email string) ([]*Conversation, error)

	//GetByID returns the User with the given ID
	GetFilteredConversations(email string, input string) ([]*Conversation, error)

	//inserts new message into the database, and returns it
	InsertMessage(newMessage *NewMessage, userEmail string) ([]*Message, error)

	//Update applies UserUpdates to the given user ID
	InsertConversation(newConversation *NewConversation, userEmail string) (*Conversation, error)

	//Delete deletes the user with the given ID
	// Delete(userID bson.ObjectId) error
}
