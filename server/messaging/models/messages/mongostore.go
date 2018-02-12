package messages

import (
	"fmt"
	"strings"

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

//Get every single messsage for a user
// func (s *MongoStore) GetMessages(email string, input string) ([]*Message, error) {
// 	messages := []*Message{}
// 	message := &Message{}
// 	col := s.session.DB(s.dbname).C(s.colname)
// 	iter := col.Find(nil).Iter()
// 	for iter.Next(message) {
// 		messages = append(messages, message)
// 	}
// 	return messages, nil
// }

//Get every single conversation for a user
func (s *MongoStore) GetConversations(userEmail string) ([]*Conversation, error) {
	conversations := []*Conversation{}
	col := s.session.DB(s.dbname).C(s.colname)
	err := col.Find(bson.M{"email": userEmail}).Sort("createdAt").All(conversations)
	if err != nil {
		return nil, fmt.Errorf("error getting conversations: %v", err)
	}
	return conversations, nil
}

//Get every single conversation for a user
func (s *MongoStore) GetFilteredConversations(email string, input string) ([]*Conversation, error) {
	conversations := []*Conversation{}
	conversation := &Conversation{}
	col := s.session.DB(s.dbname).C(s.colname)
	iter := col.Find(nil).Iter()
	for iter.Next(conversation) {
		for i := 0; i < len(conversation.Messages); i++ {
			message := conversation.Messages[i]
			if strings.Contains(message.TextBody, input) {
				conversations = append(conversations, conversation)
				i++
			}
		}
	}
	return conversations, nil
}

//InsertMessage insert a new message into the database and returns it
func (s *MongoStore) InsertMessage(newMessage *Message) (*Message, error) {
	col := s.session.DB(s.dbname).C(s.colname)
	if err := col.Insert(newMessage); err != nil {
		return nil, fmt.Errorf("error inserting new message: %v", err)
	}
	return newMessage, nil
}

//InsertConversation inserts a new conversation into the database and returns it
func (s *MongoStore) InsertConversation(newConversation *Conversation) (*Conversation, error) {
	col := s.session.DB(s.dbname).C(s.colname)
	if err := col.Insert(newConversation); err != nil {
		return nil, fmt.Errorf("error inserting new conversation : %v", err)
	}
	return newConversation, nil
}

//Delete deletes message from database
// func (s *MongoStore) Delete(userID bson.ObjectId) error {
// 	col := s.session.DB(s.dbname).C(s.colname)
// 	return col.RemoveId(userID)
// }
