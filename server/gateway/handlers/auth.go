package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"gopkg.in/mgo.v2/bson"

	"github.com/EJacobson96/Milestone/server/gateway/models/users"
	"github.com/EJacobson96/Milestone/server/gateway/sessions"
)

//UsersHnalder allows users to create new accounts
func (c *HandlerContext) UsersHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		newUser := &users.NewUser{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(newUser)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding user: %v", err), http.StatusBadRequest)
			return
		}

		//validate the new user
		err = newUser.Validate()
		if err != nil {
			http.Error(w, fmt.Sprintf("error validating user: %v", err), http.StatusBadRequest)
			return
		}

		//check that the email doesn't already exist
		checkUser, err := c.UsersStore.GetByEmail(newUser.Email)
		if checkUser != nil {
			http.Error(w, fmt.Sprintf("error finding user: %v", err), http.StatusBadRequest)
			return
		}

		//insert new user into the database
		user, err := c.UsersStore.Insert(newUser)
		if err != nil {
			http.Error(w, fmt.Sprintf("error inserting into database: %v", err), http.StatusInternalServerError)
			return
		}

		//start a new session
		session := &SessionState{
			Time: time.Now(),
			User: user,
		}
		_, err = sessions.BeginSession(c.SigningKey, c.SessionsStore, session, w)
		if err != nil {
			http.Error(w, fmt.Sprintf("error starting session: %v", err), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)

		err = json.NewEncoder(w).Encode(user)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding user to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

//UsersMeHandler gets the current user logged in and patches user data
func (c *HandlerContext) UsersMeHandler(w http.ResponseWriter, r *http.Request) {
	sessionState := &SessionState{}
	//get the session state
	sessionID, err := sessions.GetState(r, c.SigningKey, c.SessionsStore, sessionState)
	if err != nil {
		http.Error(w, fmt.Sprintf("error getting state: %v", err), http.StatusUnauthorized)
		return
	}
	err = c.SessionsStore.Save(sessionID, sessionState)
	if err != nil {
		http.Error(w, fmt.Sprintf("error saving session state: %v", err), http.StatusInternalServerError)
		return
	}
	switch r.Method {
	case "GET":
		//returns the current user
		currentUser, err := c.UsersStore.GetByID(sessionState.User.ID)
		if err != nil {
			http.Error(w, fmt.Sprintf("error getting user: %v", err), http.StatusInternalServerError)
		}
		err = json.NewEncoder(w).Encode(currentUser)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding user: %v", err), http.StatusInternalServerError)
			return
		}
	case "PATCH":
		updates := &users.UpdateUser{}
		userID := r.URL.Query().Get("id")
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(updates)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding user updates: %v", err), http.StatusInternalServerError)
			return
		}
		//updates the user with the updated fields
		user, err := c.UsersStore.UpdateUser(bson.ObjectIdHex(userID), updates)
		if err != nil {
			http.Error(w, fmt.Sprintf("error applying user updates: %v", err), http.StatusBadRequest)
			return
		}

		err = json.NewEncoder(w).Encode(user)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding user to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

//SessionsHanlder handles log in and starting a new session
func (c *HandlerContext) SessionsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		credentials := &users.Credentials{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(credentials)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding credentials: %v", err), http.StatusBadRequest)
			return
		}
		user, err := c.UsersStore.GetByEmail(credentials.Email)
		if user == nil {
			user.Authenticate(credentials.Password)
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}

		//checks to see if the credentials are valid
		err = user.Authenticate(credentials.Password)
		if err != nil {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}

		//begins a new redis session
		session := &SessionState{
			Time: time.Now(),
			User: user,
		}
		_, err = sessions.BeginSession(c.SigningKey, c.SessionsStore, session, w)
		if err != nil {
			http.Error(w, fmt.Sprintf("error starting session: %v", err), http.StatusInternalServerError)
			return
		}
		err = json.NewEncoder(w).Encode(user)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding user to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

//SessionsMineHandler ends a session when the user is logged out
func (c *HandlerContext) SessionsMineHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "DELETE":
		sessionState := &SessionState{}
		_, err := sessions.GetState(r, c.SigningKey, c.SessionsStore, sessionState)
		if err != nil {
			http.Error(w, fmt.Sprintf("error getting the session state: %v", err), http.StatusUnauthorized)
			return
		}
		//ends the current sessions
		_, err = sessions.EndSession(r, c.SigningKey, c.SessionsStore)
		if err != nil {
			http.Error(w, "error ending session", http.StatusInternalServerError)
			return
		}

		//respond to client saying that the user has been signed out
		w.Write([]byte("signed out"))
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}
