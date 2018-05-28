package messages

import (
	"errors"
	"fmt"
	"time"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

//MongoStore implements Store for MongoDB
type MongoStore struct {
	session *mgo.Session
	dbname  string
	colname string
}

//NewMongoStore constructs a new MongoStore
func NewMongoStore(sess *mgo.Session, dbName string, collectionName string) *MongoStore {
	if sess == nil {
		panic("nil pointer passed for session")
	}
	return &MongoStore{
		session: sess,
		dbname:  dbName,
		colname: collectionName,
	}
}

//GetByID returns the covnersation with the given ID
func (s *MongoStore) GetByID(id bson.ObjectId) (*Conversation, error) {
	conversation := &Conversation{}
	col := s.session.DB(s.dbname).C(s.colname)
	err := col.FindId(id).One(&conversation)
	if err != nil {
		return nil, fmt.Errorf("error finding conversation: %v", err)
	}
	return conversation, nil
}

//GetConversations returns every conversation based on the given userID
func (s *MongoStore) GetConversations(userID bson.ObjectId) ([]*Conversation, error) {
	conversations := []*Conversation{}
	filteredConversations := []*Conversation{}
	col := s.session.DB(s.dbname).C(s.colname)
	err := col.Find(nil).Sort("-lastmessage").Limit(50).All(&conversations)
	if err != nil {
		return nil, fmt.Errorf("error finding conversations: %v", err)
	}
	//filters for conversations based on the given userID
	for _, conversation := range conversations {
		for i := 0; i < len(conversation.Members); i++ {
			member := conversation.Members[i]
			if member.ID == userID {
				filteredConversations = append(filteredConversations, conversation)
				i = len(conversation.Members)
			}
		}
	}
	return filteredConversations, nil
}

//InsertMessage inserts new message into the database and returns the conversation
func (s *MongoStore) InsertMessage(newMessage *NewMessage, userID bson.ObjectId) (*Conversation, error) {
	conversation := &Conversation{}
	//validates the new message
	err := newMessage.Validate()
	if err != nil {
		return nil, fmt.Errorf("error validating new message: %v", err)
	}
	//converts the newmessage to a message
	message, err := newMessage.ToMessage(userID)
	if err != nil {
		return nil, fmt.Errorf("error converting new message: %v", err)
	}
	col := s.session.DB(s.dbname).C(s.colname)
	if err := col.FindId(message.ConversationID).One(&conversation); err != nil {
		return nil, fmt.Errorf("error finding conversation: %v", err)
	}
	//checks to make sure the given userID is in the conversation
	checkMember := false
	for _, member := range conversation.Members {
		if member.ID == userID {
			checkMember = true
		}
	}
	if !checkMember {
		return nil, errors.New("unauthorized to create message")
	}
	message.ID = bson.NewObjectId()
	conversation.LastMessage = time.Now()
	//adds new message to the conversation
	conversation.Messages = append(conversation.Messages, message)
	if err = col.UpdateId(conversation.ID, conversation); err != nil {
		return nil, fmt.Errorf("error inserting new message: %v", err)
	}
	return conversation, nil
}

//InsertConversation inserts a new conversation in the database and returns it
func (s *MongoStore) InsertConversation(newConversation *NewConversation, userID bson.ObjectId) (*Conversation, error) {
	conversationID := bson.NewObjectId()
	newConversation.Message.ConversationID = conversationID
	err := newConversation.Validate()
	if err != nil {
		return nil, fmt.Errorf("error validating messaging: %v", err)
	}
	//validates the first message in a conversation
	err = newConversation.Message.Validate()
	if err != nil {
		return nil, fmt.Errorf("error validating new message: %v", err)
	}
	//convers the first new message to a message
	message, err := newConversation.Message.ToMessage(userID)
	if err != nil {
		return nil, fmt.Errorf("error converting message: %v", err)
	}
	//converts the new conversation to a conversations
	conversation, err := newConversation.ToConversation()
	if err != nil {
		return nil, fmt.Errorf("error converting new conversation: %v", err)
	}
	message.ID = bson.NewObjectId()
	message.ConversationID = conversationID
	conversation.ID = conversationID
	//adds the message to the conversation
	conversation.Messages = append(conversation.Messages, message)
	col := s.session.DB(s.dbname).C(s.colname)
	err = col.Insert(&conversation)
	if err != nil {
		return nil, fmt.Errorf("error inserting conversation : %v", err)
	}
	insertedConversation := &Conversation{}
	err = col.FindId(conversationID).One(&insertedConversation)
	if err != nil {
		return nil, fmt.Errorf("error finding conversation: %v", err)
	}
	return insertedConversation, nil
}
