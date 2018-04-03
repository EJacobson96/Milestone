package handlers

import (
	"github.com/EJacobson96/Milestone/server/gateway/models/users"
	"github.com/EJacobson96/Milestone/server/gateway/sessions"
)

type HandlerContext struct {
	Notifier      Notifier
	SigningKey    string
	SessionsStore sessions.Store
	UsersStore    users.Store
	notifier      *Notifier
}
