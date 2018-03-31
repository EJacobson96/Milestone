package handlers

import "github.com/EJacobson96/Milestone/server/messaging/models/messages"

type HandlerContext struct {
	MessagesStore messages.Store
}
