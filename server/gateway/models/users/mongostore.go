package users

import (
	"fmt"

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

//GetAllUsers returns every single user
func (s *MongoStore) GetAllUsers() ([]*User, error) {
	users := []*User{}
	col := s.session.DB(s.dbname).C(s.colname)
	err := col.Find(nil).Sort("fullName").Limit(50).All(&users)
	if err != nil {
		return nil, fmt.Errorf("error getting users: %v", err)
	}
	return users, nil
}

//GetByID returns the User with the given ID
func (s *MongoStore) GetByID(id bson.ObjectId) (*User, error) {
	user := &User{}
	col := s.session.DB(s.dbname).C(s.colname)
	err := col.FindId(id).One(&user)
	if err != nil {
		return nil, fmt.Errorf("error finding user: %v", err)
	}
	return user, nil
}

//GetByEmail returns the User with the given email
func (s *MongoStore) GetByEmail(email string) (*User, error) {
	user := &User{}
	col := s.session.DB(s.dbname).C(s.colname)
	err := col.Find(bson.M{"email": email}).One(&user)
	if err != nil {
		return nil, fmt.Errorf("error finding user: %v", err)
	}
	return user, nil
}

//GetByUserName returns the User with the given Username
func (s *MongoStore) GetByUserName(username string) (*User, error) {
	user := &User{}
	col := s.session.DB(s.dbname).C(s.colname)
	err := col.Find(bson.M{"username": username}).One(&user)
	if err != nil {
		return nil, fmt.Errorf("error finding user: %v", err)
	}
	return user, nil
}

//UpdateConnections adds a connection for a user and returns the connection list
func (s *MongoStore) UpdateConnections(update *UpdateConnections, userID bson.ObjectId) (*User, error) {
	user := &User{}
	change := mgo.Change{
		Update: bson.M{"$set": update},
	}
	col := s.session.DB(s.dbname).C(s.colname)
	_, err := col.FindId(userID).Apply(change, &User{})
	if err != nil {
		return nil, fmt.Errorf("error applying changes to connections: %v", err)
	}
	err = col.FindId(userID).One(&user)
	if err != nil {
		return nil, fmt.Errorf("error finding user: %v", err)
	}
	return user, nil
}

//AddNotification adds a notification for a user and returns it
func (s *MongoStore) UpdateNotifications(update *UpdateNotifications, userID bson.ObjectId) (*User, error) {
	user := &User{}
	change := mgo.Change{
		Update: bson.M{"$set": update},
	}
	col := s.session.DB(s.dbname).C(s.colname)
	_, err := col.FindId(userID).Apply(change, &User{})
	if err != nil {
		return nil, fmt.Errorf("error applying changes to notifications: %v", err)
	}
	err = col.FindId(userID).One(&user)
	if err != nil {
		return nil, fmt.Errorf("error finding user: %v", err)
	}
	return user, nil
}

//UpdateRequests adds a request for a user and returns it
func (s *MongoStore) UpdateRequests(update *UpdateRequests, userID bson.ObjectId) (*User, error) {
	user := &User{}
	change := mgo.Change{
		Update: bson.M{"$set": update},
	}
	col := s.session.DB(s.dbname).C(s.colname)
	_, err := col.FindId(userID).Apply(change, &User{})
	if err != nil {
		return nil, fmt.Errorf("error applying changes to requests: %v", err)
	}
	err = col.FindId(userID).One(&user)
	if err != nil {
		return nil, fmt.Errorf("error finding user: %v", err)
	}
	return user, nil
}

//Update applies UserUpdates to the given user ID
func (s *MongoStore) UpdateUser(userID bson.ObjectId, updates *UpdateUser) (*User, error) {
	user := &User{}
	change := mgo.Change{
		Update: bson.M{"$set": updates},
	}
	col := s.session.DB(s.dbname).C(s.colname)
	_, err := col.FindId(userID).Apply(change, &User{})
	if err != nil {
		return nil, fmt.Errorf("error updating user: %v", err)
	}
	err = col.FindId(userID).One(&user)
	if err != nil {
		return nil, fmt.Errorf("error finding user: %v", err)
	}
	return user, nil
}

//Insert converts the NewUser to a User, inserts it into the database, and returns it
func (s *MongoStore) Insert(newUser *NewUser) (*User, error) {
	user, err := newUser.ToUser()
	if err != nil {
		return nil, err
	}
	col := s.session.DB(s.dbname).C(s.colname)
	err = col.Insert(user)
	if err != nil {
		return nil, fmt.Errorf("error inserting new user: %v", err)
	}
	return user, nil
}

//Delete deletes the user with the given ID
func (s *MongoStore) Delete(userID bson.ObjectId) error {
	col := s.session.DB(s.dbname).C(s.colname)
	return col.RemoveId(userID)
}
