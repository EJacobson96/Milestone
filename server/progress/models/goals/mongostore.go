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

//GetResources gets all the resources in the database for a given user
func (s *MongoStore) GetResources(userID bson.ObjectId) ([]*ResourceCategory, error) {
	resources := []*ResourceCategory{}
	filteredResources := []*ResourceCategory{}
	col := s.session.DB(s.dbname).C(s.colname)
	err := col.Find(nil).Sort("title").Limit(50).All(&resources)
	if err != nil {
		return nil, fmt.Errorf("error finding resources: %v", err)
	}
	for _, resource := range resources {
		if resource.UserID == userID {
			filteredResources = append(filteredResources, resource)
		}
	}
	return filteredResources, nil
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

//GetSpecificResource takes in a resourceID and returns the resource category associated with that id
func (s *MongoStore) GetSpecificResource(resourceID bson.ObjectId) (*ResourceCategory, error) {
	resource := &ResourceCategory{}
	col := s.session.DB(s.dbname).C(s.colname)
	err := col.FindId(resourceID).One(&resource)
	if err != nil {
		return nil, fmt.Errorf("error finding resource category: %v", err)
	}
	return resource, nil
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

//InsertResource inserts a new resource in the database
func (s *MongoStore) InsertResource(newResource *NewResourceCategory) (*ResourceCategory, error) {
	err := newResource.Validate()
	if err != nil {
		return nil, fmt.Errorf("error validating new resource category: %v", err)
	}
	resource := newResource.ToResourceCategory()
	if err != nil {
		return nil, fmt.Errorf("error creating new resource category: %v", err)
	}
	col := s.session.DB(s.dbname).C(s.colname)
	err = col.Insert(&resource)
	if err != nil {
		return nil, fmt.Errorf("error inserting resource category : %v", err)
	}
	return resource, nil
}

//UpdateGoal updates a goal with new goal in the database
func (s *MongoStore) UpdateGoal(update *UpdateGoal, goalID bson.ObjectId) (*Goal, error) {
	goal := &Goal{}
	change := mgo.Change{
		Update: bson.M{"$set": update},
	}
	col := s.session.DB(s.dbname).C(s.colname)
	_, err := col.FindId(goalID).Apply(change, &Goal{})
	if err != nil {
		return nil, fmt.Errorf("error updating goal: %v", err)
	}
	err = col.FindId(goalID).One(&goal)
	if err != nil {
		return nil, fmt.Errorf("error finding goal: %v", err)
	}
	return goal, nil
}

//UpdateResource updates a goal with new data
func (s *MongoStore) UpdateResource(update *UpdateResourceCategory, resourceID bson.ObjectId) (*ResourceCategory, error) {
	resource := &ResourceCategory{}
	change := mgo.Change{
		Update: bson.M{"$set": update},
	}
	col := s.session.DB(s.dbname).C(s.colname)
	_, err := col.FindId(resourceID).Apply(change, &ResourceCategory{})
	if err != nil {
		return nil, fmt.Errorf("error updating resource category: %v", err)
	}
	err = col.FindId(resourceID).One(&resource)
	if err != nil {
		return nil, fmt.Errorf("error finding resource category: %v", err)
	}
	return resource, nil
}

//DeleteGoal deletes a goal from the database
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

//DeleteResource deletes a resource category from the database
func (s *MongoStore) DeleteResource(resourceID bson.ObjectId) (*ResourceCategory, error) {
	resource := &ResourceCategory{}
	col := s.session.DB(s.dbname).C(s.colname)
	err := col.FindId(resourceID).One(&resource)
	if err != nil {
		return nil, fmt.Errorf("error finding resource category: %v", err)
	}
	err = col.RemoveId(resourceID)
	if err != nil {
		return nil, fmt.Errorf("error deleting resource category: %v", err)
	}
	return resource, nil
}
