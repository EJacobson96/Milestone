package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"strings"

	"github.com/EJacobson96/Milestone/server/gateway/models/notifications"

	"github.com/EJacobson96/Milestone/server/gateway/models/users"
	"github.com/EJacobson96/Milestone/server/gateway/sessions"
	"gopkg.in/mgo.v2/bson"
)

//handles searching for a participant based on user input
func (c *HandlerContext) ParticipantHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		participants := []*users.User{}
		query := r.URL.Query().Get("q")
		allUsers, err := c.UsersStore.GetAllUsers()
		if err != nil {
			http.Error(w, fmt.Sprintf("error grabbing users from database: %v", err), http.StatusInternalServerError)
			return
		}
		for _, user := range allUsers {
			if strings.ToLower(user.AccountType) == "participant" &&
				strings.Contains(strings.ToLower(user.GetFullName()), strings.TrimSpace(strings.ToLower(query))) {
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

//handles finding all connections for a given user and sorts them alphebetically based on fullname
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
		connections := []*users.User{}
		query := r.URL.Query().Get("q")
		user, err := c.UsersStore.GetByID(sessionState.User.ID)
		if err != nil {
			http.Error(w, fmt.Sprintf("error finding user: %v", err), http.StatusBadRequest)
			return
		}
		//filters out users based on user input
		for _, user := range user.Connections {
			if strings.Contains(strings.ToLower(user.GetFullName()), strings.TrimSpace(strings.ToLower(query))) {
				connections = append(connections, user)
			}
		}
		//sorts slice based on fullname
		sort.Slice(connections, func(i, j int) bool {
			return connections[i].FullName < connections[j].FullName
		})
		err = json.NewEncoder(w).Encode(connections)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding users to JSON: %v", err), http.StatusInternalServerError)
		}
	case "PATCH":
		connections := []*users.User{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(connections)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding connection: %v", err), http.StatusInternalServerError)
			return
		}
		connections, err = c.UsersStore.UpdateConnections(sessionState.User.ID, connections)
		if err != nil {
			http.Error(w, fmt.Sprintf("error adding connection: %v", err), http.StatusInternalServerError)
			return
		}
		err = json.NewEncoder(w).Encode(connections)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding user to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

//handles searching for a service provider based on user input
func (c *HandlerContext) ServiceProviderHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		query := r.URL.Query().Get("q")
		serviceProviders := []*users.User{}
		allUsers, err := c.UsersStore.GetAllUsers()
		if err != nil {
			http.Error(w, fmt.Sprintf("error grabbing users from database: %v", err), http.StatusInternalServerError)
			return
		}
		//filters out users based on account type and user input
		for _, user := range allUsers {
			if strings.ToLower(user.AccountType) == "service provider" &&
				strings.Contains(strings.ToLower(user.GetFullName()), strings.TrimSpace(strings.ToLower(query))) {
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

func (c *HandlerContext) SpecificContactHandler(w http.ResponseWriter, r *http.Request) {
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
		contactID := r.URL.Query().Get("id")
		contact, err := c.UsersStore.GetByID(bson.ObjectIdHex(contactID))
		if err != nil {
			http.Error(w, fmt.Sprintf("error getting user: %v", err), http.StatusInternalServerError)
			return
		}
		err = json.NewEncoder(w).Encode(contact)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding user to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

func (c *HandlerContext) NotificationsHandler(w http.ResponseWriter, r *http.Request) {
	// sessionState := &SessionState{}
	// sessionID, err := sessions.GetState(r, c.SigningKey, c.SessionsStore, sessionState)
	// if err != nil {
	// 	http.Error(w, fmt.Sprintf("error getting state: %v", err), http.StatusUnauthorized)
	// 	return
	// }
	switch r.Method {
	case "PATCH":
		notification := &notifications.Notification{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(notification)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding notification: %v", err), http.StatusInternalServerError)
			return
		}
		notification, err = c.UsersStore.AddNotification(notification)
		if err != nil {
			http.Error(w, fmt.Sprintf("error adding notification: %v", err), http.StatusInternalServerError)
		}
		err = json.NewEncoder(w).Encode(notification)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding notification to JSON: %v", err), http.StatusInternalServerError)
			return
		}
		notificationPayload := struct {
			Payload *notifications.Notification `json:"payload"`
		}{
			notification,
		}
		payload, jsonErr := json.Marshal(notificationPayload)
		if jsonErr != nil {
			http.Error(w, fmt.Sprintf("error marshalling payload to JSON: %v", jsonErr), http.StatusInternalServerError)
			return
		}
		c.Notifier.Notify(payload)
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

func (c *HandlerContext) RequestsHandler(w http.ResponseWriter, r *http.Request) {
	// sessionState := &SessionState{}
	// sessionID, err := sessions.GetState(r, c.SigningKey, c.SessionsStore, sessionState)
	// if err != nil {
	// 	http.Error(w, fmt.Sprintf("error getting state: %v", err), http.StatusUnauthorized)
	// 	return
	// }
	switch r.Method {
	case "PATCH":
		request := []*notifications.Request{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(request)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding request: %v", err), http.StatusInternalServerError)
		}
		request, err = c.UsersStore.UpdateRequests(request)
		if err != nil {
			http.Error(w, fmt.Sprintf("error adding request: %v", err), http.StatusInternalServerError)
			return
		}
		err = json.NewEncoder(w).Encode(request)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding notification to JSON: %v", err), http.StatusInternalServerError)
			return
		}
		requestPayload := struct {
			Payload []*notifications.Request `json:"payload"`
		}{
			request,
		}
		payload, jsonErr := json.Marshal(requestPayload)
		if jsonErr != nil {
			http.Error(w, fmt.Sprintf("error marshalling payload to JSON: %v", jsonErr), http.StatusInternalServerError)
			return
		}
		c.Notifier.Notify(payload)
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}
