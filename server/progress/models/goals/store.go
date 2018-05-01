package goals

import "gopkg.in/mgo.v2/bson"

//Store represents a store for messages
type Store interface {

	//GetGoals gets all the goals in the database for a give user
	GetGoals(userID bson.ObjectId) ([]*Goal, error)

	//GetSpecificGoal takes in a goalID and returns the goal associated with that id
	GetSpecificGoal(goalID bson.ObjectId) (*Goal, error)

	//InsertGoals inserts a new goal in the database
	InsertGoal(newGoal *NewGoal) (*Goal, error)

	//InsertTask inserts a new task for a give goal
	// InsertTask(newTask *NewTask) ([]*Task, error)

	//UpdateGoal updates a goal with new data
	UpdateGoal(update *UpdateGoal, goalID bson.ObjectId) (*Goal, error)

	//DeleteGoal deletes a goal from the database
	DeleteGoal(goalID bson.ObjectId) (*Goal, error)
}
