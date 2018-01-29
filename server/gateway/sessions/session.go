package sessions

import (
	"errors"
	"fmt"
	"net/http"
	"strings"
)

const headerAuthorization = "Authorization"
const paramAuthorization = "auth"
const schemeBearer = "Bearer "

//ErrNoSessionID is used when no session ID was found in the Authorization header
var ErrNoSessionID = errors.New("no session ID found in " + headerAuthorization + " header")

//ErrInvalidScheme is used when the authorization scheme is not supported
var ErrInvalidScheme = errors.New("authorization scheme not supported")

//BeginSession creates a new SessionID, saves the `sessionState` to the store, adds an
//Authorization header to the response with the SessionID, and returns the new SessionID
func BeginSession(signingKey string, store Store, sessionState interface{}, w http.ResponseWriter) (SessionID, error) {
	if len(signingKey) == 0 {
		return InvalidSessionID, fmt.Errorf("sessions ID can not be empty")
	}
	sessionID, err := NewSessionID(signingKey)
	if err != nil {
		return sessionID, fmt.Errorf("invalid session id: %v", err)
	}
	err = store.Save(sessionID, sessionState)
	if err != nil {
		return sessionID, fmt.Errorf("could not save to the session store: %v", err)
	}
	w.Header().Add(headerAuthorization, schemeBearer+string(sessionID))
	return sessionID, nil
}

//GetSessionID extracts and validates the SessionID from the request headers
func GetSessionID(r *http.Request, signingKey string) (SessionID, error) {
	if len(signingKey) == 0 {
		return InvalidSessionID, fmt.Errorf("sessions ID can not be empty")
	}
	var auth string
	if len(r.Header.Get(headerAuthorization)) == 0 {
		auth = r.URL.Query().Get("auth")
	} else {
		auth = r.Header.Get(headerAuthorization)
	}

	validateAuth := strings.Split(auth, " ")
	if validateAuth[0] != strings.TrimSpace(schemeBearer) {
		return InvalidSessionID, ErrNoSessionID
	}

	sessionID, err := ValidateID(validateAuth[1], signingKey)
	if err != nil {
		return sessionID, fmt.Errorf("not a valid sessionID: %v", err)
	}
	return sessionID, nil
}

//GetState extracts the SessionID from the request,
//gets the associated state from the provided store into
//the `sessionState` parameter, and returns the SessionID
func GetState(r *http.Request, signingKey string, store Store, sessionState interface{}) (SessionID, error) {
	sessionID, err := GetSessionID(r, signingKey)
	if err != nil {
		return sessionID, fmt.Errorf("not a valid sessionID: %v", err)
	}
	err = store.Get(sessionID, sessionState)
	if err != nil {
		return sessionID, ErrStateNotFound
	}
	return sessionID, nil
}

//EndSession extracts the SessionID from the request,
//and deletes the associated data in the provided store, returning
//the extracted SessionID.
func EndSession(r *http.Request, signingKey string, store Store) (SessionID, error) {
	sessionID, err := GetSessionID(r, signingKey)
	if err != nil {
		return sessionID, fmt.Errorf("not a valid sessionID: %v", err)
	}
	err = store.Delete(sessionID)
	if err != nil {
		return sessionID, fmt.Errorf("error deleting from store: %v", err)
	}
	return sessionID, nil
}
