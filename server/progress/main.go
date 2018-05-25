package main

import (
	"log"
	"net/http"
	"os"

	"github.com/EJacobson96/Milestone/server/progress/handlers"
	"github.com/EJacobson96/Milestone/server/progress/models/goals"
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
	resourceStore := goals.NewMongoStore(session, "db", "resources")
	context := handlers.HandlerContext{
		GoalsStore:    mongostore,
		ResourceStore: resourceStore,
	}

	http.HandleFunc("/goals", context.GoalHandler)                  //handles getting goals, inserting goals, updating and deleting goals
	http.HandleFunc("/goals/", context.SpecificGoalHandler)         //handles getting a specific goal
	http.HandleFunc("/resources", context.ResourceHandler)          //handles getting resources, inserting resoures, updating and deleting resources
	http.HandleFunc("/resources/", context.SpecificResourceHandler) //handles getting a specific resource

	log.Printf("server is listening at http://%s...", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
