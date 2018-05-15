package goals

import (
	"errors"
	"time"
)

type Task struct {
	ID          string      `json:"id" bson:"_id"`
	GoalID      string      `json:"goalID"`
	CreatorID   string      `json:"creatorID"`
	Title       string      `json:"title"`
	Description string      `json:"description"`
	DueDate     time.Time   `json:"dueDate"`
	Active      bool        `json:"active"`
	Completed   bool        `json:"completed"`
	Comments    []*Comment  `json:"comments"`
	Resources   []*Resource `json:"resources"`
}

type NewTask struct {
	GoalID      string      `json:"goalID"`
	CreatorID   string      `json:"creatorID"`
	Title       string      `json:"title"`
	Description string      `json:"description"`
	DueDate     time.Time   `json:"dueDate"`
	Comments    []*Comment  `json:"comments"`
	Resources   []*Resource `json:"resources"`
}

type Comment struct {
	Creator   string    `json:"creator"`
	TextBody  string    `json:"textBody"`
	CreatedAt time.Time `json:"createdAt"`
}

type Resource struct {
	Title string `json:"title"`
	URL   string `json:"url"`
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
		// ID:          bson.NewObjectId(),
		GoalID:      nt.GoalID,
		CreatorID:   nt.CreatorID,
		Title:       nt.Title,
		Description: nt.Description,
		DueDate:     nt.DueDate,
		Active:      true,
		Completed:   false,
		Comments:    nt.Comments,
		Resources:   nt.Resources,
	}
}
