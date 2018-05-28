package handlers

import "github.com/EJacobson96/Milestone/server/progress/models/goals"

//HandlerContext represents the goal store and resource store than can be accessed by the handlers
type HandlerContext struct {
	GoalsStore    goals.Store
	ResourceStore goals.Store
}
