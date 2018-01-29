package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/info344-a17/challenges-EJacobson96/servers/gateway/models/users"
	"github.com/info344-a17/challenges-EJacobson96/servers/gateway/sessions"
)

func (c *HandlerContext) UsersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
	newUser := &users.NewUser{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(newUser)
	if err != nil {
		http.Error(w, "error decoding user", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	err = newUser.Validate()
	if err != nil {
		http.Error(w, "error validating user", http.StatusInternalServerError)
		return
	}

	checkUser, err := c.UsersStore.GetByEmail(newUser.Email)
	if checkUser != nil {
		http.Error(w, "user already exists", http.StatusBadRequest)
		return
	}

	checkUser, err = c.UsersStore.GetByUserName(newUser.UserName)
	if checkUser != nil {
		http.Error(w, "user already exists", http.StatusBadRequest)
		return
	}

	user, err := c.UsersStore.Insert(newUser)
	if err != nil {
		http.Error(w, "error inserting into database", http.StatusInternalServerError)
		return
	}
	session := &SessionState{
		Time: time.Now(),
		User: user,
	}
	_, err = sessions.BeginSession(c.SigningKey, c.SessionsStore, session, w)
	if err != nil {
		http.Error(w, "error starting session", http.StatusInternalServerError)
		return
	}
	err = json.NewEncoder(w).Encode(user)
	if err != nil {
		http.Error(w, "error encoding user", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

func (c *HandlerContext) UsersMeHandler(w http.ResponseWriter, r *http.Request) {
	sessionState := &SessionState{}
	sessionID, err := sessions.GetState(r, c.SigningKey, c.SessionsStore, sessionState)
	if err != nil {
		http.Error(w, fmt.Sprintf("error getting state: %v", err), http.StatusUnauthorized)
		return
	}
	if r.Method == "GET" {
		err = c.SessionsStore.Save(sessionID, sessionState)
		if err != nil {
			http.Error(w, "error saving session state", http.StatusInternalServerError)
			return
		}

		err = json.NewEncoder(w).Encode(sessionState.User)
		if err != nil {
			http.Error(w, "error encoding user", http.StatusInternalServerError)
			return
		}
	} else if r.Method == "PATCH" {
		updates := &users.Updates{}
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(updates)
		if err != nil {
			http.Error(w, "error decoding updates", http.StatusInternalServerError)
			return
		}
		defer r.Body.Close()

		err = c.UsersStore.Update(sessionState.User.ID, updates)
		if err != nil {
			http.Error(w, "error applying updates", http.StatusBadRequest)
			return
		}

		err = sessionState.User.ApplyUpdates(updates)
		if err != nil {
			http.Error(w, "error applying updates to cache", http.StatusBadRequest)
			return
		}

		err = json.NewEncoder(w).Encode(sessionState.User)
		if err != nil {
			http.Error(w, "error encoding user", http.StatusInternalServerError)
			return
		}
	} else {
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}

func (c *HandlerContext) SessionsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
	credentials := &users.Credentials{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(credentials)
	if err != nil {
		http.Error(w, "error decoding credentials", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	user, err := c.UsersStore.GetByEmail(credentials.Email)
	if user == nil {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	err = user.Authenticate(credentials.Password)
	if err != nil {
		http.Error(w, fmt.Sprintf("invalid credentials: %v", err), http.StatusUnauthorized)
		return
	}

	session := &SessionState{
		Time: time.Now(),
		User: user,
	}
	_, err = sessions.BeginSession(c.SigningKey, c.SessionsStore, session, w)
	if err != nil {
		http.Error(w, "error starting session", http.StatusInternalServerError)
		return
	}
	err = json.NewEncoder(w).Encode(user)
	if err != nil {
		http.Error(w, "error encoding user", http.StatusInternalServerError)
		return
	}
}

func (c *HandlerContext) SessionsMineHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "DELETE" {
		sessionState := &SessionState{}
		_, err := sessions.GetState(r, c.SigningKey, c.SessionsStore, sessionState)
		if err != nil {
			http.Error(w, "error getting state", http.StatusUnauthorized)
			return
		}
		_, err = sessions.EndSession(r, c.SigningKey, c.SessionsStore)
		if err != nil {
			http.Error(w, "error ending session", http.StatusInternalServerError)
			return
		}

		err = json.NewEncoder(w).Encode("signed out")
		if err != nil {
			http.Error(w, "error signing out", http.StatusInternalServerError)
			return
		}
	} else {
		http.Error(w, "wrong type of method", http.StatusMethodNotAllowed)
		return
	}
}
