package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func (c *HandlerContext) ConversationHandler(w http.ResponseWriter, r http.Request) {
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

func (c *HandlerContext) SearchConversationsHandler(w http.ResponseWriter, r http.Request) {
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
