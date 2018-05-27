package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"gopkg.in/mgo.v2/bson"

	"github.com/EJacobson96/Milestone/server/messaging/models/messages"
)

//ConversationHandler handles getting conversations for a user and creation of a new conversation
func (c *HandlerContext) ConversationHandler(w http.ResponseWriter, r *http.Request) {
	//check to see if the current user is authenticated
	err := authenticateUser(r)
	if err != nil {
		http.Error(w, fmt.Sprintf("error authenticating user: %v", err), http.StatusInternalServerError)
		return
	}
	switch r.Method {
	case "GET":
		userID := r.URL.Query().Get("id")
		query := r.URL.Query().Get("q")
		filteredConversations := []*messages.Conversation{}
		//gets all conversations of a user based on the id params
		conversations, err := c.MessagesStore.GetConversations(bson.ObjectIdHex(userID))
		if err != nil {
			http.Error(w, fmt.Sprintf("error getting conversations from database: %v", err), http.StatusBadRequest)
			return
		}
		//filters conversations based on query params
		filteredConversations = FilterConversations(conversations, query)
		//encodes the filtered conversations back to the client
		err = json.NewEncoder(w).Encode(filteredConversations)
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
		//inserts a new conversation for a user into the database
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

//SpecificConversationHandler handles getting a specific conversation thread
func (c *HandlerContext) SpecificConversationHandler(w http.ResponseWriter, r *http.Request) {
	//check to see if the current user is authenticated
	err := authenticateUser(r)
	if err != nil {
		http.Error(w, fmt.Sprintf("error authenticating user: %v", err), http.StatusInternalServerError)
		return
	}
	switch r.Method {
	case "GET":
		conversationID := r.URL.Query().Get("id")
		//returns a conversation based on the id params
		conversation, err := c.MessagesStore.GetByID(bson.ObjectIdHex(conversationID))
		if err != nil {
			http.Error(w, fmt.Sprintf("error getting conversation: %v", err), http.StatusInternalServerError)
			return
		}
		err = json.NewEncoder(w).Encode(conversation)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding user to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

//MessagesHandler handles posting a new message to a conversation
func (c *HandlerContext) MessagesHandler(w http.ResponseWriter, r *http.Request) {
	//check to see if the current user is authenticated
	err := authenticateUser(r)
	if err != nil {
		http.Error(w, fmt.Sprintf("error authenticating user: %v", err), http.StatusInternalServerError)
		return
	}
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
		//inserts a new message into a conversation thread for a user using the id params
		conversation, err := c.MessagesStore.InsertMessage(newMessage, bson.ObjectIdHex(userID))
		err = json.NewEncoder(w).Encode(conversation)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding user to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}
