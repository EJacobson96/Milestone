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
			http.Error(w, fmt.Sprintf("error encoding goals to JSON: %v", err), http.StatusInternalServerError)
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
		if err != nil {
			http.Error(w, fmt.Sprintf("error inserting goal into database: %v", err), http.StatusBadRequest)
			return
		}
		err = json.NewEncoder(w).Encode(goal)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding goal to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	case "PATCH":
		update := &goals.UpdateGoal{}
		goalID := r.URL.Query().Get("id")
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(update)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding goal: %v", err), http.StatusInternalServerError)
		}
		goal, err := c.GoalsStore.UpdateGoal(update, bson.ObjectIdHex(goalID))
		if err != nil {
			http.Error(w, fmt.Sprintf("error updating goal: %v", err), http.StatusInternalServerError)
			return
		}
		err = json.NewEncoder(w).Encode(goal)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding goal to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	case "DELETE":
		goalID := r.URL.Query().Get("id")
		goal := &goals.Goal{}
		goal, err := c.GoalsStore.DeleteGoal(bson.ObjectIdHex(goalID))
		if err != nil {
			http.Error(w, fmt.Sprintf("error deleting goal from database: %v", err), http.StatusBadRequest)
			return
		}
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

func (c *HandlerContext) SpecificGoalHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		goalID := r.URL.Query().Get("id")
		goal, err := c.GoalsStore.GetSpecificGoal(bson.ObjectIdHex(goalID))
		if err != nil {
			http.Error(w, fmt.Sprintf("error getting goal from database: %v", err), http.StatusBadRequest)
			return
		}
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

func (c *HandlerContext) ResourceHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		userID := r.URL.Query().Get("id")
		resources, err := c.ResourceStore.GetResources(bson.ObjectIdHex(userID))
		if err != nil {
			http.Error(w, fmt.Sprintf("error getting resources from database: %v", err), http.StatusBadRequest)
			return
		}
		err = json.NewEncoder(w).Encode(resources)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding resources to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	case "POST":
		newResourceCategory := &goals.NewResourceCategory{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(newResourceCategory)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding resource category: %v", err), http.StatusInternalServerError)
			return
		}
		resourceCategory, err := c.ResourceStore.InsertResource(newResourceCategory)
		if err != nil {
			http.Error(w, fmt.Sprintf("error inserting resource category into database: %v", err), http.StatusBadRequest)
			return
		}
		err = json.NewEncoder(w).Encode(resourceCategory)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding resource category to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	case "PATCH":
		update := &goals.UpdateResourceCategory{}
		resourceID := r.URL.Query().Get("id")
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(update)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding resource category: %v", err), http.StatusInternalServerError)
		}
		resource, err := c.ResourceStore.UpdateResource(update, bson.ObjectIdHex(resourceID))
		if err != nil {
			http.Error(w, fmt.Sprintf("error updating resource category: %v", err), http.StatusInternalServerError)
			return
		}
		err = json.NewEncoder(w).Encode(resource)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding resource category to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	case "DELETE":
		resourceID := r.URL.Query().Get("id")
		resource := &goals.ResourceCategory{}
		resource, err := c.ResourceStore.DeleteResource(bson.ObjectIdHex(resourceID))
		if err != nil {
			http.Error(w, fmt.Sprintf("error deleting resource category from database: %v", err), http.StatusBadRequest)
			return
		}
		err = json.NewEncoder(w).Encode(resource)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding resource category to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

func (c *HandlerContext) SpecificResourceHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		resourceID := r.URL.Query().Get("id")
		resource, err := c.ResourceStore.GetSpecificResource(bson.ObjectIdHex(resourceID))
		if err != nil {
			http.Error(w, fmt.Sprintf("error getting resource category from database: %v", err), http.StatusBadRequest)
			return
		}
		err = json.NewEncoder(w).Encode(resource)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding resource category to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}
