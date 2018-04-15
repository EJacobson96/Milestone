package main

import (
	"log"
	"net/http"
	"os"

	"github.com/EJacobson96/Milestone/server/gateway/models/goals"

	"github.com/EJacobson96/Milestone/server/gateway/handlers"
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
	mongostore := goals.NewMongoStore(session, "db", "goals")
	context := handlers.HandlerContext{
		GoalsStore: mongostore,
	}

	log.Printf("server is listening at http://%s...", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
