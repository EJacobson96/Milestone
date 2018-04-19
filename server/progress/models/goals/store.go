package goals

import "gopkg.in/mgo.v2/bson"

//Store represents a store for messages
type Store interface {

	//GetGoals gets all the goals in the database for a give user
	GetGoals(userID bson.ObjectId) ([]*Goal, error)

	//InsertGoals inserts a new goal in the database
	InsertGoal(newGoal *NewGoal) (*Goal, error)

	//InsertTask inserts a new task for a give goal
	InsertTask(newTask *NewTask) ([]*Task, error)
}
