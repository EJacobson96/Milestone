package users

import (
	"errors"

	"github.com/EJacobson96/Milestone/server/gateway/models/notifications"

	"gopkg.in/mgo.v2/bson"
)

//ErrUserNotFound is returned when the user can't be found
var ErrUserNotFound = errors.New("user not found")

//Store represents a store for Users
type Store interface {

	//UpdateConnections adds a connection for a user and returns the connection list
	UpdateConnections(userID bson.ObjectId, connections []*User) ([]*User, error)

	//AddNotification adds a notification for a user and returns it
	AddNotification(notification *notifications.Notification) (*notifications.Notification, error)

	//UpdateRequests adds a request for a user and returns it
	UpdateRequests(request []*notifications.Request) ([]*notifications.Request, error)

	//GetAllUsers returns every single user
	GetAllUsers() ([]*User, error)

	//GetByID returns the User with the given ID
	GetByID(id bson.ObjectId) (*User, error)

	//GetByEmail returns the User with the given email
	GetByEmail(email string) (*User, error)

	//GetByUserName returns the User with the given Username
	GetByUserName(username string) (*User, error)

	//Insert converts the NewUser to a User, inserts
	//it into the database, and returns it
	Insert(newUser *NewUser) (*User, error)

	//Update applies UserUpdates to the given user ID
	Update(userID bson.ObjectId, updates *Updates) error

	//Delete deletes the user with the given ID
	Delete(userID bson.ObjectId) error
}
