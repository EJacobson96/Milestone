package goals

import "gopkg.in/mgo.v2/bson"

//Store represents a store for messages
type Store interface {

	//GetGoals gets all the goals in the database for a given user
	GetGoals(userID bson.ObjectId) ([]*Goal, error)

	//GetRsources gets all the resources in the database for a given user
	GetResources(userID bson.ObjectId) ([]*ResourceCategory, error)

	//GetSpecificGoal takes in a goalID and returns the goal associated with that id
	GetSpecificGoal(goalID bson.ObjectId) (*Goal, error)

	//GetSpecificResource takes in a resourceID and returns the resource category associated with that id
	GetSpecificResource(resourceID bson.ObjectId) (*ResourceCategory, error)

	//InsertGoals inserts a new goal in the database
	InsertGoal(newGoal *NewGoal) (*Goal, error)

	//InsertResource inserts a new resource in the database
	InsertResource(newResource *NewResourceCategory) (*ResourceCategory, error)

	//UpdateGoal updates a goal with new data
	UpdateGoal(update *UpdateGoal, goalID bson.ObjectId) (*Goal, error)

	//UpdateResource updates a goal with new data
	UpdateResource(update *UpdateResourceCategory, resourceID bson.ObjectId) (*ResourceCategory, error)

	//DeleteGoal deletes a goal from the database
	DeleteGoal(goalID bson.ObjectId) (*Goal, error)

	//DeleteResource deletes a resource category from the database
	DeleteResource(resourceID bson.ObjectId) (*ResourceCategory, error)
}
