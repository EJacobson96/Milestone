package handlers

import (
	"time"

	"github.com/EJacobson96/Milestone/server/gateway/models/users"
)

//represents the current session for a user
type SessionState struct {
	Time time.Time
	User *users.User
}
