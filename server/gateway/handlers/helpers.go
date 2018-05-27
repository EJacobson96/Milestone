package handlers

import (
	"errors"
	"net/http"

	"github.com/EJacobson96/Milestone/server/gateway/sessions"
)

func (c *HandlerContext) authenticateUser(w http.ResponseWriter, r *http.Request) (*SessionState, error) {
	// Get the session state
	state := &SessionState{}

	// get the current state
	_, err := sessions.GetState(r, c.SigningKey, c.SessionsStore, &state)
	if err != nil {
		return nil, errors.New(http.StatusText(http.StatusUnauthorized))
	}
	return state, nil
}
