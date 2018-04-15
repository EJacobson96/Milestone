package goals

import "gopkg.in/mgo.v2/bson"

//Store represents a store for messages
type Store interface {

	//GetByID returns the goal with the given id
	GetByID(id bson.ObjectId) (*Goal, error)
}
