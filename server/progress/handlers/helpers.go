package handlers

import (
	"errors"
	"net/http"
	"strings"

	"github.com/EJacobson96/Milestone/server/progress/models/goals"
)

//FilterGoals filters goals based on a tasks title and description using the given query
func FilterGoals(userGoals []*goals.Goal, query string) []*goals.Goal {
	filteredGoals := []*goals.Goal{}
	for _, goal := range userGoals {
		found := false
		for i := 0; i < len(goal.Tasks); i++ {
			task := goal.Tasks[i]
			if strings.Contains(strings.ToLower(task.Title), strings.TrimSpace(strings.ToLower(query))) ||
				strings.Contains(strings.ToLower(task.Description), strings.TrimSpace(strings.ToLower(query))) {
				found = true
				i = len(goal.Tasks)
			}
		}
		if strings.Contains(strings.ToLower(goal.Title), strings.TrimSpace(strings.ToLower(query))) ||
			strings.Contains(strings.ToLower(goal.Category), strings.TrimSpace(strings.ToLower(query))) {
			found = true
		}
		if found {
			filteredGoals = append(filteredGoals, goal)
		}
	}
	return filteredGoals
}

//authenticateUser checks to make sure the "X-User" header was set in the gateway
func authenticateUser(r *http.Request) error {
	jsonUser := r.Header.Get("X-User")
	if len(jsonUser) == 0 {
		return errors.New("no X-User header set")
	}

	return nil
}
