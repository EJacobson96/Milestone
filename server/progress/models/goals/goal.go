package goals

import (
	"errors"
	"time"

	"gopkg.in/mgo.v2/bson"
)

type Goal struct {
	ID       bson.ObjectId `json:"id" bson:"_id"`
	UserID   bson.ObjectId `json:"userID"`
	Creator  bson.ObjectId `json:"creator"`
	Title    string        `json:"title"`
	Category string        `json:"category"`
	Tasks    []*Task       `json:"tasks"`
	DueDate  time.Time     `json:"dueDate"`
	Active   bool          `json:"active"`
}

type NewGoal struct {
	UserID   bson.ObjectId `json:"userID"`
	Creator  bson.ObjectId `json:"creator"`
	Title    string        `json:"title"`
	Category string        `json:"category"`
	Tasks    []*Task       `json:"tasks"`
	DueDate  time.Time     `json:"dueDate"`
}

func (ng *NewGoal) Validate() error {
	// if len(ng.Tasks) == 0 {
	// 	return errors.New("Error: no tasks created")
	// }
	if len(ng.UserID) == 0 {
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
		ID:       bson.NewObjectId(),
		UserID:   ng.UserID,
		Creator:  ng.Creator,
		Title:    ng.Title,
		Category: ng.Category,
		// Tasks:    ng.Tasks,
		DueDate: ng.DueDate,
		Active:  true,
	}
}
