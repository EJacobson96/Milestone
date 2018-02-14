package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/EJacobson96/Milestone/server/gateway/models/users"
	"github.com/EJacobson96/Milestone/server/gateway/sessions"
)

//handles searching for a participant
func (c *HandlerContext) ParticipantHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		allUsers, err := c.UsersStore.GetAllUsers()
		participants := []*users.User{}
		if err != nil {
			http.Error(w, fmt.Sprintf("error grabbing users from database: %v", err), http.StatusInternalServerError)
			return
		}
		for _, user := range allUsers {
			if strings.ToLower(user.AccountType) == "participant" {
				participants = append(participants, user)
			}
		}
		err = json.NewEncoder(w).Encode(participants)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding users to JSON: %v", err), http.StatusInternalServerError)
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

//handles finding all connectiong for a given user
func (c *HandlerContext) UserConnectionsHandler(w http.ResponseWriter, r *http.Request) {
	sessionState := &SessionState{}
	sessionID, err := sessions.GetState(r, c.SigningKey, c.SessionsStore, sessionState)
	if err != nil {
		http.Error(w, fmt.Sprintf("error getting state: %v", err), http.StatusUnauthorized)
		return
	}
	switch r.Method {
	case "GET":
		err = c.SessionsStore.Save(sessionID, sessionState)
		if err != nil {
			http.Error(w, fmt.Sprintf("error saving session state: %v", err), http.StatusInternalServerError)
			return
		}
		userConnections := sessionState.User.Connections
		err = json.NewEncoder(w).Encode(userConnections)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding users to JSON: %v", err), http.StatusInternalServerError)
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

//handles searching for a service provider
func (c *HandlerContext) ServiceProviderHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		allUsers, err := c.UsersStore.GetAllUsers()
		serviceProviders := []*users.User{}
		if err != nil {
			http.Error(w, fmt.Sprintf("error grabbing users from database: %v", err), http.StatusInternalServerError)
			return
		}
		for _, user := range allUsers {
			if strings.ToLower(user.AccountType) == "service provider" {
				serviceProviders = append(serviceProviders, user)
			}
		}
		err = json.NewEncoder(w).Encode(serviceProviders)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding users to JSON: %v", err), http.StatusInternalServerError)
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

//handles connecting with a user
func (c *HandlerContext) AddConnectionHandler(w http.ResponseWriter, r *http.Request) {
	sessionState := &SessionState{}
	sessionID, err := sessions.GetState(r, c.SigningKey, c.SessionsStore, sessionState)
	if err != nil {
		http.Error(w, fmt.Sprintf("error getting state: %v", err), http.StatusUnauthorized)
		return
	}
	switch r.Method {
	case "POST":
		err = c.SessionsStore.Save(sessionID, sessionState)
		if err != nil {
			http.Error(w, fmt.Sprintf("error saving session state: %v", err), http.StatusInternalServerError)
			return
		}
		user := &users.User{}
		email := ""
		checkUser, err := c.UsersStore.GetByEmail(user.Email)
		if checkUser != nil {
			http.Error(w, fmt.Sprintf("error finding user: %v", err), http.StatusBadRequest)
			return
		}
		decoder := json.NewDecoder(r.Body)
		err = decoder.Decode(email)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding user: %v", err), http.StatusInternalServerError)
			return
		}
		user, err = c.UsersStore.GetByEmail(user.Email)
		if user != nil {
			http.Error(w, fmt.Sprintf("error finding user: %v", err), http.StatusBadRequest)
			return
		}
		sessionState.User.Connections = append(sessionState.User.Connections, user)
		err = json.NewEncoder(w).Encode(sessionState.User.Connections)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding user to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}
