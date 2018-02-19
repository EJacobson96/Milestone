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

//Get every single conversation for a user
func (s *MongoStore) GetConversations(name string, userID bson.ObjectId) ([]*Conversation, error) {
	conversations := []*Conversation{}
	member := &Member{
		ID:       userID,
		FullName: name,
	}
	col := s.session.DB(s.dbname).C(s.colname)
	err := col.Find(bson.M{"members": bson.M{"$in": []*Member{member}}}).Sort("-lastMessage").Limit(50).All(&conversations)
	if err != nil {
		return nil, fmt.Errorf("error finding conversations: %v", err)
	}
	return conversations, nil
}

//InsertMessage insert a new message into the database and returns it
func (s *MongoStore) InsertMessage(newMessage *NewMessage, userID bson.ObjectId) ([]*Message, error) {
	conversation := &Conversation{}
	err := newMessage.Validate()
	if err != nil {
		return nil, fmt.Errorf("error validating new message: %v", err)
	}
	message, err := newMessage.ToMessage(userID)
	if err != nil {
		return nil, fmt.Errorf("error converting new message: %v", err)
	}
	col := s.session.DB(s.dbname).C(s.colname)
	if err := col.FindId(message.ConversationID).One(&conversation); err != nil {
		return nil, fmt.Errorf("error finding conversation: %v", err)
	}
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
	conversation.Messages = append(conversation.Messages, message)
	if err = col.UpdateId(conversation.ID, conversation); err != nil {
		return nil, fmt.Errorf("error inserting new message: %v", err)
	}
	return conversation.Messages, nil
}

//RemoveMemberFromConversation removes a member from a conversation
func (s *MongoStore) RemoveMemberFromConversation(removeMember *Member, conversationID bson.ObjectId) ([]*Member, error) {
	conversation := &Conversation{}
	members := []*Member{}
	col := s.session.DB(s.dbname).C(s.colname)
	if err := col.FindId(conversationID).One(&conversation); err != nil {
		return nil, fmt.Errorf("error finding conversation: %v", err)
	}
	checkMember := false
	for _, member := range conversation.Members {
		if member.ID == removeMember.ID {
			checkMember = true
		} else {
			members = append(members, member)
		}
	}
	if !checkMember {
		return nil, errors.New("member is not part of conversation")
	}
	conversation.Members = members
	if err := col.UpdateId(conversation.ID, conversation); err != nil {
		return nil, fmt.Errorf("error inserting new message: %v", err)
	}
	return conversation.Members, nil
}

//InsertConversation inserts a new conversation into the database and returns it
func (s *MongoStore) InsertConversation(newConversation *NewConversation, userID bson.ObjectId) (*Conversation, error) {
	conversationID := bson.NewObjectId()
	newConversation.Message.ConversationID = conversationID
	err := newConversation.Validate()
	if err != nil {
		return nil, fmt.Errorf("error validating messaging: %v", err)
	}
	err = newConversation.Message.Validate()
	if err != nil {
		return nil, fmt.Errorf("error validating new message: %v", err)
	}
	message, err := newConversation.Message.ToMessage(userID)
	if err != nil {
		return nil, fmt.Errorf("error converting message: %v", err)
	}
	conversation, err := newConversation.ToConversation()
	if err != nil {
		return nil, fmt.Errorf("error converting new conversation: %v", err)
	}
	message.ID = bson.NewObjectId()
	message.ConversationID = conversationID
	conversation.ID = conversationID
	conversation.Messages = append(conversation.Messages, message)
	col := s.session.DB(s.dbname).C(s.colname)
	if err := col.Insert(&conversation); err != nil {
		return nil, fmt.Errorf("error inserting conversation : %v", err)
	}
	return conversation, nil
}
