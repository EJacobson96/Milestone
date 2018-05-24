package goals

import (
	"errors"

	"gopkg.in/mgo.v2/bson"
)

type ResourceCategory struct {
	ID        bson.ObjectId `json:"id" bson:"_id"`
	UserID    bson.ObjectId `json:"userID"`
	Title     string        `json:"title"`
	Resources []*Entity     `json:"resources"`
}

//Since resource struct already exists, named resource object entity
type Entity struct {
	ID           bson.ObjectId `json:"id" 3bson:"_id"`
	Title        string        `json:"title"`
	ResourceName string        `json:"resourceName"`
}

type NewResourceCategory struct {
	Title  string        `json:"title"`
	UserID bson.ObjectId `json:"userID"`
}

type UpdateResourceCategory struct {
	Resources []*Entity `json:"resources"`
}

func (nr *NewResourceCategory) Validate() error {
	if len(nr.Title) == 0 {
		return errors.New("Error: no title set")
	}
	return nil
}

func (nr *NewResourceCategory) ToResourceCategory() *ResourceCategory {
	return &ResourceCategory{
		ID:     bson.NewObjectId(),
		UserID: nr.UserID,
		Title:  nr.Title,
	}
}
