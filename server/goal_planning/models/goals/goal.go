package goals

import (
	"errors"
	"time"

	"gopkg.in/mgo.v2/bson"
)

type Goal struct {
	UserID   bson.ObjectId
	Creator  bson.ObjectId
	Title    string
	Category string
	Tasks    []*Task
	DueDate  time.Time
	Active   bool
}

type NewGoal struct {
	UserID   bson.ObjectId
	Creator  bson.ObjectId
	Title    string
	Category string
	Tasks    []*Task
	DueDate  time.Time
}

func (ng *NewGoal) Validate() error {
	if len(ng.Tasks) == 0 {
		return errors.New("Error: no tasks created")
	} else if len(ng.UserID) == 0 {
		return errors.New("Error: no user found")
	} else if len(ng.Creator) == 0 {
		return errors.New("Error: no creator found")
	} else if len(ng.Title) == 0 {
		return errors.New("Error: no title found")
	} else if len(ng.Category) == 0 {
		return errors.New("Error: no category found")
	}
	return nil
}

func (ng *NewGoal) ToGoal() *Goal {
	return &Goal{
		UserID:   ng.UserID,
		Creator:  ng.Creator,
		Title:    ng.Title,
		Category: ng.Category,
		Tasks:    ng.Tasks,
		DueDate:  ng.DueDate,
		Active:   true,
	}
}
