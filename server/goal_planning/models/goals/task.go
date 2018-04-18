package goals

import (
	"errors"
	"time"

	"gopkg.in/mgo.v2/bson"
)

type Task struct {
	GoalID      bson.ObjectId
	CreatorID   bson.ObjectId
	Title       string
	Description string
	DueDate     time.Time
	// Comments    []*Comments
	// Resources   []*Resources
	Active bool
}

type NewTask struct {
	GoalID      bson.ObjectId
	CreatorID   bson.ObjectId
	Title       string
	Description string
	DueDate     time.Time
	// Comments    []*Comments
	// Resources   []*Resources
}

func (nt *NewTask) Validate() error {
	if len(nt.GoalID) == 0 {
		return errors.New("Error: no goal found")
	} else if len(nt.CreatorID) == 0 {
		return errors.New("Error: no creator found")
	} else if len(nt.Title) == 0 {
		return errors.New("Error: no title found")
	}
	return nil
}

func (nt *NewTask) ToTask() *Task {
	return &Task{
		GoalID:      nt.GoalID,
		CreatorID:   nt.CreatorID,
		Title:       nt.Title,
		Description: nt.Description,
		DueDate:     nt.DueDate,
		Active:      true,
	}
}
