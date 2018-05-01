package goals

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

//GetGoals gets all the goals in the database for a give user
func (s *MongoStore) GetGoals(userID bson.ObjectId) ([]*Goal, error) {
	goals := []*Goal{}
	filteredGoals := []*Goal{}
	col := s.session.DB(s.dbname).C(s.colname)
	err := col.Find(nil).Sort("-dueDate").Limit(50).All(&goals)
	if err != nil {
		return nil, fmt.Errorf("error finding goals: %v", err)
	}
	for _, goal := range goals {
		if goal.UserID == userID {
			filteredGoals = append(filteredGoals, goal)
		}
	}
	return filteredGoals, nil
}

//GetSpecificGoal takes in a goalID and returns the goal associated with that id
func (s *MongoStore) GetSpecificGoal(goalID bson.ObjectId) (*Goal, error) {
	goal := &Goal{}
	col := s.session.DB(s.dbname).C(s.colname)
	err := col.FindId(goalID).One(&goal)
	if err != nil {
		return nil, fmt.Errorf("error finding goal: %v", err)
	}
	return goal, nil
}

//InsertGoals inserts a new goal in the database
func (s *MongoStore) InsertGoal(newGoal *NewGoal) (*Goal, error) {
	err := newGoal.Validate()
	if err != nil {
		return nil, fmt.Errorf("error validating new goal: %v", err)
	}
	goal := newGoal.ToGoal()
	if err != nil {
		return nil, fmt.Errorf("error creating new goal: %v", err)
	}
	col := s.session.DB(s.dbname).C(s.colname)
	err = col.Insert(&goal)
	if err != nil {
		return nil, fmt.Errorf("error inserting goal : %v", err)
	}
	return goal, nil
}

// func (s *MongoStore) InsertTask(newTask *NewTask) ([]*Task, error) {
// 	goal := &Goal{}
// 	err := newTask.Validate()
// 	if err != nil {
// 		return nil, fmt.Errorf("error validating new task: %v", err)
// 	}
// 	task := newTask.ToTask()
// 	if err != nil {
// 		return nil, fmt.Errorf("error creating new task: %v", err)
// 	}
// 	col := s.session.DB(s.dbname).C(s.colname)
// 	if err := col.FindId(task.GoalID).One(&goal); err != nil {
// 		return nil, fmt.Errorf("error finding goal: %v", err)
// 	}
// 	goal.Tasks = append(goal.Tasks, task)
// 	if err = col.UpdateId(task.GoalID, goal); err != nil {
// 		return nil, fmt.Errorf("error inserting new message: %v", err)
// 	}
// 	return goal.Tasks, nil
// }

func (s *MongoStore) UpdateGoal(update *UpdateGoal, goalID bson.ObjectId) (*Goal, error) {
	goal := &Goal{}
	change := mgo.Change{
		Update: bson.M{"$set": update},
	}
	col := s.session.DB(s.dbname).C(s.colname)
	_, err := col.FindId(goalID).Apply(change, &Goal{})
	if err != nil {
		return nil, fmt.Errorf("error updating user: %v", err)
	}
	err = col.FindId(goalID).One(&goal)
	if err != nil {
		return nil, fmt.Errorf("error finding user: %v", err)
	}
	return goal, nil
}

func (s *MongoStore) DeleteGoal(goalID bson.ObjectId) (*Goal, error) {
	goal := &Goal{}
	col := s.session.DB(s.dbname).C(s.colname)
	err := col.FindId(goalID).One(&goal)
	if err != nil {
		return nil, fmt.Errorf("error finding goal: %v", err)
	}
	err = col.RemoveId(goalID)
	if err != nil {
		return nil, fmt.Errorf("error deleting goal: %v", err)
	}
	return goal, nil
}
