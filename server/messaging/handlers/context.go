package handlers

import "github.com/EJacobson96/Milestone/server/messaging/models/messages"

//HandlerContext allows handlers to reference the MessagesStore
type HandlerContext struct {
	MessagesStore messages.Store
}
