package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/EJacobson96/Milestone/server/gateway/handlers"

	"github.com/EJacobson96/Milestone/server/gateway/models/users"

	"github.com/EJacobson96/Milestone/server/gateway/sessions"
	"gopkg.in/mgo.v2"

	"github.com/go-redis/redis"
)

func GetCurrentUser(r *http.Request, c handlers.HandlerContext) *users.User {
	sessionState := &handlers.SessionState{}
	_, err := sessions.GetState(r, c.SigningKey, c.SessionsStore, sessionState)
	if err != nil {
		return nil
	}
	return sessionState.User
}

func NewServiceProxy(addrs []string, c handlers.HandlerContext) *httputil.ReverseProxy {
	nextIndex := 0
	mx := sync.Mutex{}
	return &httputil.ReverseProxy{
		Director: func(r *http.Request) {
			//modify the request to indicate
			//remote host
			user := GetCurrentUser(r, c)
			if user == nil {
				r.Header.Del("X-User")
			}
			userJSON, err := json.Marshal(user)
			if err != nil {
				log.Printf("error marshaling user: %v", err)
			}
			r.Header.Add("X-User", string(userJSON))

			mx.Lock()
			r.URL.Host = addrs[nextIndex%len(addrs)]
			nextIndex++
			mx.Unlock()
			r.URL.Scheme = "http"
		},
	}
}

//main is the main entry point for the server
func main() {
	//gets the value of the ADDR environment variable
	addr := os.Getenv("ADDR")

	//If addr is not set, sets default to ":443," all requests are
	//listening on 443
	if len(addr) == 0 {
		addr = ":443"
	}

	tlsKeyPath := os.Getenv("TLSKEY")
	tlsCertPath := os.Getenv("TLSCERT")
	sessionKey := os.Getenv("SESSIONKEY")
	reddisADDR := os.Getenv("REDISADDR")
	dbADDR := os.Getenv("DBADDR")
	messagesSvcAddrs := os.Getenv("MESSAGESSVCADDR")
	splitMessagesSvcAddrs := strings.Split(messagesSvcAddrs, ",")

	if len(tlsKeyPath) == 0 || len(tlsCertPath) == 0 {
		log.Fatal("please insert TLSKEY and TLSCERT")
	} else if len(sessionKey) == 0 {
		log.Fatal("SESSIONKEY")
	} else if len(reddisADDR) == 0 {
		log.Fatal("redisADDR")
	} else if len(dbADDR) == 0 {
		log.Fatal("DBADDR")
	}

	client := redis.NewClient(&redis.Options{
		Addr:     reddisADDR,
		Password: "",
		DB:       0,
	})

	redisStore := sessions.NewRedisStore(client, time.Duration(30)*time.Minute)
	session, err := mgo.Dial(dbADDR)
	if err != nil {
		log.Fatal("error dialing database")
	}
	mongoStore := users.NewMongoStore(session, "db", "users")
	notifier := handlers.NewNotifier()
	context := handlers.HandlerContext{
		SigningKey:    sessionKey,
		SessionsStore: redisStore,
		UsersStore:    mongoStore,
		Notifier:      *notifier,
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/users", context.UsersHandler)                      //handles creating a new user
	mux.HandleFunc("/users/me", context.UsersMeHandler)                 //handles getting the current user
	mux.HandleFunc("/sessions", context.SessionsHandler)                //handles beginning a new session
	mux.HandleFunc("/sessions/mine", context.SessionsMineHandler)       //handles ending a session
	mux.HandleFunc("/participants", context.ParticipantHandler)         //handles searching for a participant
	mux.HandleFunc("/serviceproviders", context.ServiceProviderHandler) //handles searching for a service provider
	mux.HandleFunc("/connections", context.UserConnectionsHandler)      //handles all changes made to a user's connections list
	mux.HandleFunc("/contact/", context.SpecificContactHandler)         //handles getting a specific contact based on id
	mux.HandleFunc("/notifications", context.NotificationsHandler)      //handles posting new notifications
	mux.HandleFunc("/requests", context.RequestsHandler)                //handles all user requests
	mux.Handle("/ws", handlers.NewWebSocketsHandler(notifier))

	//messaging microservice
	mux.Handle("/conversations", NewServiceProxy(splitMessagesSvcAddrs, context))  //handles returning all conversations for a user and creating new conversation
	mux.Handle("/conversations/", NewServiceProxy(splitMessagesSvcAddrs, context)) //handles getting a specific conversation based on id
	mux.Handle("/messages", NewServiceProxy(splitMessagesSvcAddrs, context))       //handles inserting new message into a conversation
	mux.Handle("/member", NewServiceProxy(splitMessagesSvcAddrs, context))         //handles removing a member from a conversation
	// mux.Handle("/search/conversations", NewServiceProxy(splitMessagesSvcAddrs, context)) //handles searching through conversations

	corsMux := handlers.NewCORSHandler(mux)

	fmt.Printf("server is listening at http://%s\n", addr)
	log.Fatal(http.ListenAndServeTLS(addr, tlsCertPath, tlsKeyPath, corsMux))
}
