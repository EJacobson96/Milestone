package handlers

import "github.com/EJacobson96/Milestone/server/goal_planning/models/goals"

type HandlerContext struct {
	GoalsStore goals.Store
}
