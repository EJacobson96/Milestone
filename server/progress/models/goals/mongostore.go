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

//GetByID returns the covnersation with the given ID
// func (s *MongoStore) GetByID(id bson.ObjectId) (*Task, error) {
// 	task := &Task{}
// 	col := s.session.DB(s.dbname).C(s.colname)
// 	err := col.FindId(id).One(&task)
// 	if err != nil {
// 		return nil, fmt.Errorf("error finding conversation: %v", err)
// 	}
// 	return task, nil
// }

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

func (s *MongoStore) InsertTask(newTask *NewTask) ([]*Task, error) {
	goal := &Goal{}
	err := newTask.Validate()
	if err != nil {
		return nil, fmt.Errorf("error validating new task: %v", err)
	}
	task := newTask.ToTask()
	if err != nil {
		return nil, fmt.Errorf("error creating new task: %v", err)
	}
	col := s.session.DB(s.dbname).C(s.colname)
	if err := col.FindId(task.GoalID).One(&goal); err != nil {
		return nil, fmt.Errorf("error finding goal: %v", err)
	}
	goal.Tasks = append(goal.Tasks, task)
	if err = col.UpdateId(task.GoalID, goal); err != nil {
		return nil, fmt.Errorf("error inserting new message: %v", err)
	}
	return goal.Tasks, nil
}
