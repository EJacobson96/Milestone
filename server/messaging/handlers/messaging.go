package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"gopkg.in/mgo.v2/bson"

	"github.com/EJacobson96/Milestone/server/messaging/models/messages"
)

//handles grabbing conversations for a user and creation of a new conversation
func (c *HandlerContext) ConversationHandler(w http.ResponseWriter, r *http.Request) {
	// authUser := r.Header.Get("X-User")
	// if len(authUser) == 0 {
	// 	http.Error(w, errors.New("unauthorized").Error(), http.StatusUnauthorized)
	// 	return
	// }
	switch r.Method {
	case "GET":
		userID := r.URL.Query().Get("id")
		userFullName := r.URL.Query().Get("name")
		conversations, err := c.MessagesStore.GetConversations(userFullName, bson.ObjectIdHex(userID))
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
		userID := r.URL.Query().Get("id")
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(newConversation)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding user: %v", err), http.StatusInternalServerError)
			return
		}
		conversation, err := c.MessagesStore.InsertConversation(newConversation, bson.ObjectIdHex(userID))
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
	// authUser := r.Header.Get("X-User")
	// if len(authUser) == 0 {
	// 	http.Error(w, errors.New("unauthorized").Error(), http.StatusUnauthorized)
	// 	return
	// }
	switch r.Method {
	case "POST":
		userID := r.URL.Query().Get("id")
		newMessage := &messages.NewMessage{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(newMessage)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding user: %v", err), http.StatusInternalServerError)
			return
		}
		messages, err := c.MessagesStore.InsertMessage(newMessage, bson.ObjectIdHex(userID))
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
	// authUser := r.Header.Get("X-User")
	// if len(authUser) == 0 {
	// 	http.Error(w, errors.New("unauthorized").Error(), http.StatusUnauthorized)
	// 	return
	// }
	switch r.Method {
	case "GET":
		query := r.URL.Query().Get("q")
		userID := r.URL.Query().Get("id")
		userFullName := r.URL.Query().Get("name")
		filteredConversations := []*messages.Conversation{}
		conversations, err := c.MessagesStore.GetConversations(userFullName, bson.ObjectIdHex(userID))
		if err != nil {
			http.Error(w, fmt.Sprintf("error getting conversations from database: %v", err), http.StatusBadRequest)
			return
		}
		filteredConversations = FilterConversations(conversations, query)
		err = json.NewEncoder(w).Encode(filteredConversations)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding user to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

func (c *HandlerContext) MembersHandler(w http.ResponseWriter, r *http.Request) {
	// authUser := r.Header.Get("X-User")
	// if len(authUser) == 0 {
	// 	http.Error(w, errors.New("unauthorized").Error(), http.StatusUnauthorized)
	// 	return
	// }
	switch r.Method {
	case "DELETE":
		conversationID := r.URL.Query().Get("id")
		removeMember := &messages.Member{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(removeMember)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding user: %v", err), http.StatusInternalServerError)
			return
		}
		members, err := c.MessagesStore.RemoveMemberFromConversation(removeMember, bson.ObjectIdHex(conversationID))
		if err != nil {
			http.Error(w, fmt.Sprintf("error getting conversations from database: %v", err), http.StatusBadRequest)
			return
		}
		err = json.NewEncoder(w).Encode(members)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding user to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}
