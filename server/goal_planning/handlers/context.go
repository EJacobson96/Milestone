package handlers

import "github.com/EJacobson96/Milestone/server/messaging/models/goals"

type HandlerContext struct {
	GoalsStore goals.Store
}
