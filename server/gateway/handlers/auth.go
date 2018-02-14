package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/EJacobson96/Milestone/server/gateway/models/users"
	"github.com/EJacobson96/Milestone/server/gateway/sessions"
)

func (c *HandlerContext) UsersHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		newUser := &users.NewUser{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(newUser)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding user: %v", err), http.StatusInternalServerError)
			return
		}

		err = newUser.Validate()
		if err != nil {
			http.Error(w, fmt.Sprintf("error validating user: %v", err), http.StatusBadRequest)
			return
		}

		checkUser, err := c.UsersStore.GetByEmail(newUser.Email)
		if checkUser != nil {
			http.Error(w, fmt.Sprintf("error finding user: %v", err), http.StatusBadRequest)
			return
		}

		checkUser, err = c.UsersStore.GetByUserName(newUser.UserName)
		if checkUser != nil {
			http.Error(w, fmt.Sprintf("error finding user: %v", err), http.StatusBadRequest)
			return
		}

		user, err := c.UsersStore.Insert(newUser)
		if err != nil {
			http.Error(w, fmt.Sprintf("error inserting into database: %v", err), http.StatusInternalServerError)
			return
		}
		user, err = c.UsersStore.Insert(newUser)
		if err != nil {
			http.Error(w, fmt.Sprintf("error inserting into database: %v", err), http.StatusInternalServerError)
			return
		}
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

func (c *HandlerContext) UsersMeHandler(w http.ResponseWriter, r *http.Request) {
	sessionState := &SessionState{}
	sessionID, err := sessions.GetState(r, c.SigningKey, c.SessionsStore, sessionState)
	if err != nil {
		http.Error(w, fmt.Sprintf("error getting state: %v", err), http.StatusUnauthorized)
		return
	}
	switch r.Method {
	case "GET":
		err = c.SessionsStore.Save(sessionID, sessionState)
		if err != nil {
			http.Error(w, fmt.Sprintf("error saving session state: %v", err), http.StatusInternalServerError)
			return
		}
		err = json.NewEncoder(w).Encode(sessionState.User)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding user: %v", err), http.StatusInternalServerError)
			return
		}
	case "PATCH":
		updates := &users.Updates{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(updates)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding updates: %v", err), http.StatusInternalServerError)
			return
		}
		err = c.UsersStore.Update(sessionState.User.ID, updates)
		if err != nil {
			http.Error(w, fmt.Sprintf("error applying updates: %v", err), http.StatusBadRequest)
			return
		}

		err = sessionState.User.ApplyUpdates(updates)
		if err != nil {
			http.Error(w, fmt.Sprintf("error applying updates to cache: %v", err), http.StatusBadRequest)
			return
		}
		err = json.NewEncoder(w).Encode(sessionState.User)
		if err != nil {
			http.Error(w, fmt.Sprintf("error encoding user to JSON: %v", err), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

func (c *HandlerContext) SessionsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		credentials := &users.Credentials{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(credentials)
		if err != nil {
			http.Error(w, fmt.Sprintf("error decoding credentials: %v", err), http.StatusInternalServerError)
			return
		}
		user, err := c.UsersStore.GetByEmail(credentials.Email)
		if user == nil {
			user.Authenticate(credentials.Password)
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}

		err = user.Authenticate(credentials.Password)
		if err != nil {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}

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

func (c *HandlerContext) SessionsMineHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "DELETE":
		_, err := sessions.EndSession(r, c.SigningKey, c.SessionsStore)
		if err != nil {
			http.Error(w, "error ending session", http.StatusInternalServerError)
			return
		}

		w.Write([]byte("signed out"))
		if err != nil {
			http.Error(w, "error signing out", http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}
