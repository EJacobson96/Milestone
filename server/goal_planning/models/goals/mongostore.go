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
func (s *MongoStore) GetByID(id bson.ObjectId) (*Task, error) {
	task := &Task{}
	col := s.session.DB(s.dbname).C(s.colname)
	err := col.FindId(id).One(&task)
	if err != nil {
		return nil, fmt.Errorf("error finding conversation: %v", err)
	}
	return task, nil
}

func (s *MongoStore) InsertGoal() {

}
