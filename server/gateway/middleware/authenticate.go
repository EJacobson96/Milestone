package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/EJacobson96/Milestone/server/gateway/handlers"

	"github.com/EJacobson96/Milestone/server/gateway/sessions"
)

//Auth creates a new Auth stuct
type Auth struct {
	handler http.Handler
	context *handlers.HandlerContext
}

//ServeHTTP handles the request by adding the Auth headers
//and calling the real handler if the method is something other
//then OPTIONS (used for pre-flight requests)
func (a *Auth) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	sessionState := &handlers.SessionState{}
	_, err := sessions.GetState(r, a.context.SigningKey, a.context.SessionsStore, sessionState)
	if err != nil {
		http.Error(w, fmt.Sprintf("unauthorized: %v", err), http.StatusUnauthorized)
		return
	}

	jsonUser, err := json.Marshal(sessionState.User)
	if err != nil {
		http.Error(w, fmt.Sprintf("error marshaling user: %v", err), http.StatusInternalServerError)
		return
	}

	r.Header.Add("X-User", string(jsonUser))
	a.handler.ServeHTTP(w, r)
}

//NewAuth constructs a new Auth middleware handler
func NewAuth(handlerToWrap http.Handler, context *handlers.HandlerContext) *Auth {
	return &Auth{handlerToWrap, context}
}
