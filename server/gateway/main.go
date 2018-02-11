package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/EJacobson96/Milestone/server/gateway/handlers"

	"github.com/EJacobson96/Milestone/server/gateway/models/users"

	"github.com/EJacobson96/Milestone/server/gateway/sessions"
	"gopkg.in/mgo.v2"

	"github.com/go-redis/redis"
)

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

	context := handlers.HandlerContext{
		SigningKey:    sessionKey,
		SessionsStore: redisStore,
		UsersStore:    mongoStore,
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/users", context.UsersHandler)
	mux.HandleFunc("/users/me", context.UsersMeHandler)
	mux.HandleFunc("/sessions", context.SessionsHandler)
	mux.HandleFunc("/sessions/mine", context.SessionsMineHandler)
	mux.HandleFunc("/participants", context.ParticipantHandler)
	mux.HandleFunc("/serviceproviders", context.ServiceProviderHandler)
	mux.HandleFunc("/connections", context.UserConnectionsHandler)
	mux.HandleFunc("/connect", context.AddConnectionHandler)

	corsMux := handlers.NewCORSHandler(mux)

	fmt.Printf("server is listening at http://%s\n", addr)
	log.Fatal(http.ListenAndServeTLS(addr, tlsCertPath, tlsKeyPath, corsMux))
}
