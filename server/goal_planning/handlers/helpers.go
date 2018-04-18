package handlers

import (
	"strings"

	"github.com/EJacobson96/Milestone/server/goal_planning/models/goals"
)

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
