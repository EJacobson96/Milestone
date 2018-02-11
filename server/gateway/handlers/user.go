package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/EJacobson96/Milestone/server/gateway/models/users"
	"github.com/EJacobson96/Milestone/server/gateway/sessions"
)

func (c *HandlerContext) ParticipantHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
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
	} else {
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

func (c *HandlerContext) UserConnectionsHandler(w http.ResponseWriter, r *http.Request) {
	sessionState := &SessionState{}
	sessionID, err := sessions.GetState(r, c.SigningKey, c.SessionsStore, sessionState)
	if err != nil {
		http.Error(w, fmt.Sprintf("error getting state: %v", err), http.StatusUnauthorized)
		return
	}
	if r.Method == "GET" {
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
	} else {
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

func (c *HandlerContext) ServiceProviderHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
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
	} else {
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}
