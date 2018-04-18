package main

import (
	"log"
	"net/http"
	"os"

	"github.com/EJacobson96/Milestone/server/goal_planning/handlers"
	"github.com/EJacobson96/Milestone/server/goal_planning/models/goals"
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

	http.HandleFunc("/goals", context.GoalHandler) //handles getting goals for a user and inserting new goals
	http.HandleFunc("/tasks", context.TaskHandler) //handles adding new tasks to a goal

	log.Printf("server is listening at http://%s...", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
