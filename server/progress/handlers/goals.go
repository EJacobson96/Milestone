package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/EJacobson96/Milestone/server/progress/models/goals"
	"gopkg.in/mgo.v2/bson"
)

func (c *HandlerContext) GoalHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		userID := r.URL.Query().Get("id")
		query := r.URL.Query().Get("q")
		filteredGoals := []*goals.Goal{}
		goals, err := c.GoalsStore.GetGoals(bson.ObjectIdHex(userID))
		if err != nil {
			http.Error(w, fmt.Sprintf("error getting goals from database: %v", err), http.StatusBadRequest)
			return
		}
		filteredGoals = FilterGoals(goals, query)
		err = json.NewEncoder(w).Encode(filteredGoals)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding conversgoalsations to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	case "POST":
		newGoal := &goals.NewGoal{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(newGoal)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding goal: %v", err), http.StatusInternalServerError)
			return
		}
		goal, err := c.GoalsStore.InsertGoal(newGoal)
		err = json.NewEncoder(w).Encode(goal)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding goal to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

func (c *HandlerContext) TaskHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		newTask := &goals.NewTask{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(newTask)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding new task: %v", err), http.StatusInternalServerError)
			return
		}
		tasks, err := c.GoalsStore.InsertTask(newTask)
		err = json.NewEncoder(w).Encode(tasks)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding tasks to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return

	}
}
