package goals

import (
	"errors"
	"time"

	"gopkg.in/mgo.v2/bson"
)

type Goal struct {
	ID               bson.ObjectId   `json:"id" bson:"_id"`
	UserID           bson.ObjectId   `json:"userID"`
	Creator          bson.ObjectId   `json:"creator"`
	ServiceProviders []bson.ObjectId `json:"serviceProviders"`
	Title            string          `json:"title"`
	Category         string          `json:"category"`
	Tasks            []*Task         `json:"tasks"`
	DueDate          time.Time       `json:"dueDate"`
	Active           bool            `json:"active"`
	Completed        bool            `json:"completed"`
}

type NewGoal struct {
	UserID           bson.ObjectId   `json:"userID"`
	Creator          bson.ObjectId   `json:"creator"`
	ServiceProviders []bson.ObjectId `json:"serviceProviders"`
	Title            string          `json:"title"`
	Category         string          `json:"category"`
	Tasks            []*Task         `json:"tasks"`
	Active           bool            `json:"active"`
	DueDate          time.Time       `json:"dueDate"`
}

type UpdateGoal struct {
	Title     string    `json:"title"`
	Category  string    `json:"category"`
	Tasks     []*Task   `json:"tasks"`
	DueDate   time.Time `json:"dueDate"`
	Active    bool      `json:"active"`
	Completed bool      `json:"completed"`
}

func (ng *NewGoal) Validate() error {
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
		ID:               bson.NewObjectId(),
		UserID:           ng.UserID,
		Creator:          ng.Creator,
		ServiceProviders: ng.ServiceProviders,
		Title:            ng.Title,
		Category:         ng.Category,
		DueDate:          ng.DueDate,
		Active:           ng.Active,
		Completed:        false,
	}
}
