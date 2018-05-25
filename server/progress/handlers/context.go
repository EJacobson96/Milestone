package handlers

import "github.com/EJacobson96/Milestone/server/progress/models/goals"

type HandlerContext struct {
	GoalsStore    goals.Store
	ResourceStore goals.Store
}
