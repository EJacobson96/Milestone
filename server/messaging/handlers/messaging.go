package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/EJacobson96/Milestone/server/messaging/models/messages"
)

//handles grabbing conversations for a user and creation of a new conversation
func (c *HandlerContext) ConversationHandler(w http.ResponseWriter, r *http.Request) {
	authUser := r.Header.Get("X-User")
	// if len(authUser) == 0 {
	// 	http.Error(w, errors.New("unauthorized").Error(), http.StatusUnauthorized)
	// 	return
	// }
	switch r.Method {
	case "GET":
		conversations, err := c.MessagesStore.GetConversations(authUser)
		if err != nil {
			http.Error(w, fmt.Sprintf("error getting conversations from database: %v", err), http.StatusBadRequest)
			return
		}
		err = json.NewEncoder(w).Encode(conversations)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding conversations to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	case "POST":
		newConversation := &messages.NewConversation{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(newConversation)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding user: %v", err), http.StatusInternalServerError)
			return
		}
		err = newConversation.Validate()
		if err != nil {
			http.Error(w, fmt.Sprintf("error validating conversation: %v", err), http.StatusBadRequest)
			return
		}
		conversation, err := c.MessagesStore.InsertConversation(newConversation, authUser)
		err = json.NewEncoder(w).Encode(conversation)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding conversation to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

//handles posting a new message to a conversation
func (c *HandlerContext) MessagesHandler(w http.ResponseWriter, r *http.Request) {
	authUser := r.Header.Get("X-User")
	// if len(authUser) == 0 {
	// 	http.Error(w, errors.New("unauthorized").Error(), http.StatusUnauthorized)
	// 	return
	// }
	switch r.Method {
	case "POST":
		newMessage := &messages.NewMessage{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(newMessage)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding user: %v", err), http.StatusInternalServerError)
			return
		}
		err = newMessage.Validate()
		if err != nil {
			http.Error(w, fmt.Sprintf("error validating new message: %v", err), http.StatusBadRequest)
			return
		}
		messages, err := c.MessagesStore.InsertMessage(newMessage, authUser)
		err = json.NewEncoder(w).Encode(messages)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding conversation to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

//handles searching through conversations based on user input
func (c *HandlerContext) SearchConversationsHandler(w http.ResponseWriter, r *http.Request) {
	authUser := r.Header.Get("X-User")
	// if len(authUser) == 0 {
	// 	http.Error(w, errors.New("unauthorized").Error(), http.StatusUnauthorized)
	// 	return
	// }
	switch r.Method {
	case "GET":
		conversations, err := c.MessagesStore.GetConversations(authUser)
		if err != nil {
			http.Error(w, fmt.Sprintf("error getting conversations from database: %v", err), http.StatusBadRequest)
			return
		}
		err = json.NewEncoder(w).Encode(conversations)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding user to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}
