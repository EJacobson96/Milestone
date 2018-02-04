package handlers

import (
	"time"

	"github.com/EJacobson96/Milestone/server/gateway/models/users"
)

type SessionState struct {
	Time time.Time
	User *users.User
}
