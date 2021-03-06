package users

import (
	"errors"

	"gopkg.in/mgo.v2/bson"
)

//ErrUserNotFound is returned when the user can't be found
var ErrUserNotFound = errors.New("user not found")

//Store represents a store for Users
type Store interface {

	//GetAllUsers returns every single user
	GetAllUsers() ([]*User, error)

	//GetByID returns the User with the given ID
	GetByID(id bson.ObjectId) (*User, error)

	//GetByEmail returns the User with the given email
	GetByEmail(email string) (*User, error)

	//GetByUserName returns the User with the given Username
	GetByUserName(username string) (*User, error)

	//Insert converts the NewUser to a User, inserts it into the database, and returns it
	Insert(newUser *NewUser) (*User, error)

	//Update applies updates to the given user ID
	UpdateUser(userID bson.ObjectId, updates *UpdateUser) (*User, error)

	//UpdateConnections adds a connection for a user and returns the connection list
	UpdateConnections(updates *UpdateConnections, userID bson.ObjectId) (*User, error)

	//AddNotification adds a notification for a user and returns it
	UpdateNotifications(updates *UpdateNotifications, userID bson.ObjectId) (*User, error)

	//UpdateRequests adds a request for a user and returns it
	UpdateRequests(updates *UpdateRequests, userID bson.ObjectId) (*User, error)

	//Delete deletes the user with the given ID
	Delete(userID bson.ObjectId) error
}
