package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"strings"

	"github.com/EJacobson96/Milestone/server/gateway/models/users"
	"gopkg.in/mgo.v2/bson"
)

//ParticipantHandler handles searching for a participant based on user input
func (c *HandlerContext) ParticipantHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		participants := []*users.User{}
		query := r.URL.Query().Get("q")
		//returns all the current users stored in the mongo db collection
		allUsers, err := c.UsersStore.GetAllUsers()
		if err != nil {
			http.Error(w, fmt.Sprintf("error grabbing users from database: %v", err), http.StatusInternalServerError)
			return
		}
		//filters out users based on the query passed in params
		for _, user := range allUsers {
			if strings.ToLower(user.AccountType) == "participant" &&
				strings.Contains(strings.ToLower(user.GetFullName()), strings.TrimSpace(strings.ToLower(query))) {
				participants = append(participants, user)
			}
		}
		//encodes the users back to the client
		err = json.NewEncoder(w).Encode(participants)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding users to JSON: %v", err), http.StatusInternalServerError)
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

//UserConnectionsHandler handles finding all connections for a given user and sorts them alphebetically based on fullname
func (c *HandlerContext) UserConnectionsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		connections := []*users.ShortUser{}
		query := r.URL.Query().Get("q")
		userID := r.URL.Query().Get("id")
		//gets a specific user based on the id params
		user, err := c.UsersStore.GetByID(bson.ObjectIdHex(userID))
		if err != nil {
			http.Error(w, fmt.Sprintf("error finding user: %v", err), http.StatusBadRequest)
			return
		}
		//filters out users based on user input
		for _, user := range user.Connections {
			if strings.Contains(strings.ToLower(user.FullName), strings.TrimSpace(strings.ToLower(query))) {
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
		update := &users.UpdateConnections{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(update)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding connection: %v", err), http.StatusInternalServerError)
			return
		}
		userID := r.URL.Query().Get("id")
		//gets user based on the id params and updates their list of connection using updated list
		connections, err := c.UsersStore.UpdateConnections(update, bson.ObjectIdHex(userID))
		if err != nil {
			http.Error(w, fmt.Sprintf("error adding connection: %v", err), http.StatusInternalServerError)
			return
		}
		//encodes list of connections back to client
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

//ServiceProviderHandler handles searching for a service provider based on user input
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
		//encodes list of service providers back to client
		err = json.NewEncoder(w).Encode(serviceProviders)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding users to JSON: %v", err), http.StatusInternalServerError)
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

//SpecificContactHandler handles getting specific connection for a user
func (c *HandlerContext) SpecificContactHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		contactID := r.URL.Query().Get("id")
		//gets the user based on the id params
		contact, err := c.UsersStore.GetByID(bson.ObjectIdHex(contactID))
		if err != nil {
			http.Error(w, fmt.Sprintf("error getting user: %v", err), http.StatusInternalServerError)
			return
		}
		//encodes the user back to the client
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

//NotificationsHandler handles updating a user's notifcations and notifying the client using websockets
func (c *HandlerContext) NotificationsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "PATCH":
		update := &users.UpdateNotifications{}
		userID := r.URL.Query().Get("id")
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(update)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding notification: %v", err), http.StatusInternalServerError)
			return
		}
		//updates the user based on the id params using the updates notifications list passed in body
		notificationsList, err := c.UsersStore.UpdateNotifications(update, bson.ObjectIdHex(userID))
		if err != nil {
			http.Error(w, fmt.Sprintf("error adding notification: %v", err), http.StatusInternalServerError)
		}
		//encodes notifcation list back to client
		err = json.NewEncoder(w).Encode(notificationsList)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding notification to JSON: %v", err), http.StatusInternalServerError)
			return
		}
		//notifies the client with any changes
		notificationPayload := struct {
			Payload *users.User `json:"payload"`
		}{
			notificationsList,
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

//RequestsHandler handles updating a user's requests and notifying the client with new changes
func (c *HandlerContext) RequestsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "PATCH":
		update := &users.UpdateRequests{}
		userID := r.URL.Query().Get("id")
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(update)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding request: %v", err), http.StatusInternalServerError)
		}
		//updates the user based on the id params using the update requests list
		requestsList, err := c.UsersStore.UpdateRequests(update, bson.ObjectIdHex(userID))
		if err != nil {
			http.Error(w, fmt.Sprintf("error updating request: %v", err), http.StatusInternalServerError)
			return
		}
		err = json.NewEncoder(w).Encode(requestsList)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding request to JSON: %v", err), http.StatusInternalServerError)
			return
		}
		//notifies the client with any new changes to a user's requests list
		requestPayload := struct {
			Payload *users.User `json:"payload"`
		}{
			requestsList,
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
