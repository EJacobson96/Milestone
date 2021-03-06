package main

import (
	"log"
	"net/http"
	"os"

	"github.com/EJacobson96/Milestone/server/messaging/handlers"

	"github.com/EJacobson96/Milestone/server/messaging/models/messages"
	"gopkg.in/mgo.v2"
)

func main() {
	addr := os.Getenv("ADDR")
	if len(addr) == 0 {
		addr = ":80"
	}
	dbADDR := os.Getenv("DBADDR")
	if len(dbADDR) == 0 {
		log.Fatal("DBADDR")
	}

	session, err := mgo.Dial(dbADDR)
	if err != nil {
		log.Fatal("error dialing database")
	}
	mongostore := messages.NewMongoStore(session, "db", "conversations")
	context := handlers.HandlerContext{
		MessagesStore: mongostore,
	}

	http.HandleFunc("/conversations", context.ConversationHandler)          //handles returning all conversations for a user and creating new conversation
	http.HandleFunc("/conversations/", context.SpecificConversationHandler) //handles getting a specific conversation based on id
	http.HandleFunc("/messages", context.MessagesHandler)                   //handles inserting new message into a conversation

	log.Printf("server is listening at http://%s...", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
