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
	authUser := r.Header.Get("X-User")
	if r.Method == "GET" {
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
	} else if r.Method == "POST" {
		newConversation := &messages.Conversation{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(newConversation)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding user: %v", err), http.StatusInternalServerError)
			return
		}
		conversation, err := c.MessagesStore.InsertConversation(newConversation)
		err = json.NewEncoder(w).Encode(conversation)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding conversation to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	} else {
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

//handles posting a new message to a conversation
func (c *HandlerContext) MessagesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		newMessage := &messages.Message{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(newMessage)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding user: %v", err), http.StatusInternalServerError)
			return
		}
		conversationID := bson.ObjectId(r.URL.Query().Get("objectId"))
		messages, err := c.MessagesStore.InsertMessage(conversationID, newMessage)
		err = json.NewEncoder(w).Encode(messages)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding conversation to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	} else {
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

//handles searching through conversations based on user input
func (c *HandlerContext) SearchConversationsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		authUser := r.Header.Get("X-User")
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
	} else {
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}
