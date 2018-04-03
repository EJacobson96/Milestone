package users

import (
	"fmt"
	"time"

	"github.com/EJacobson96/Milestone/server/gateway/models/notifications"
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

//Get every single user
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

func (s *MongoStore) UpdateConnections(userID bson.ObjectId, connections []*User) ([]*User, error) {
	col := s.session.DB(s.dbname).C(s.colname)
	_, err := col.UpsertId(userID, bson.M{"connections": connections})
	if err != nil {
		return nil, fmt.Errorf("error inserting new connection: %v", err)
	}
	return connections, nil
}

func (s *MongoStore) AddNotification(notification *notifications.Notification) (*notifications.Notification, error) {
	newNotification := notification
	newNotification.TimeSent = time.Now()
	col := s.session.DB(s.dbname).C(s.colname)
	for _, userID := range notification.Users {
		user := &User{}
		err := col.FindId(userID).One(&user)
		if err != nil {
			return nil, fmt.Errorf("error finding user: %v", err)
		}
		user.Notifications = append(user.Notifications, newNotification)
		_, err = col.UpsertId(userID, bson.M{"$addToSet": bson.M{"notifications": newNotification}})
		if err != nil {
			return nil, fmt.Errorf("error inserting new notification: %v", err)
		}
	}
	return newNotification, nil
}

func (s *MongoStore) UpdateRequests(requests []*notifications.Request) ([]*notifications.Request, error) {
	newRequest := requests[len(requests)-1]
	newRequest.TimeSent = time.Now()
	col := s.session.DB(s.dbname).C(s.colname)
	_, err := col.UpsertId(newRequest.User, bson.M{"notifications": requests})
	if err != nil {
		return nil, fmt.Errorf("error inserting new request: %v", err)
	}
	return requests, nil
}

//Insert converts the NewUser to a User, inserts
//it into the database, and returns it
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

//Update applies UserUpdates to the given user ID
func (s *MongoStore) Update(userID bson.ObjectId, updates *Updates) error {
	user := &User{}
	err := user.ApplyUpdates(updates)
	if err != nil {
		return fmt.Errorf("error applying updates: %v", err)
	}
	change := mgo.Change{
		Update: bson.M{"$set": updates},
	}
	col := s.session.DB(s.dbname).C(s.colname)
	if _, err := col.FindId(userID).Apply(change, user); err != nil {
		return fmt.Errorf("error updating user: %v", err)
	}
	return nil
}

//Delete deletes the user with the given ID
func (s *MongoStore) Delete(userID bson.ObjectId) error {
	col := s.session.DB(s.dbname).C(s.colname)
	return col.RemoveId(userID)
}
