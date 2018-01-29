package users

import (
	"strings"
	"testing"

	"gopkg.in/mgo.v2"
)

func TestMongoStore(t *testing.T) {
	newUser := &NewUser{
		Email:        "bob@bob.com",
		Password:     "secret",
		PasswordConf: "secret",
		UserName:     "username",
		FirstName:    "Sue",
		LastName:     "Jones",
	}

	newUser2 := &NewUser{
		Email:        "dog@comcast",
		Password:     "password",
		PasswordConf: "password",
		UserName:     "streetlights",
		FirstName:    "Billy",
		LastName:     "Bob",
	}

	newUser3 := &NewUser{}

	updates := &Updates{
		FirstName: "",
		LastName:  "",
	}

	session, _ := mgo.Dial("localhost")
	store := NewMongoStore(session, "db", "users")
	user, err := store.GetByEmail(newUser2.Email)
	if err == nil {
		t.Errorf("expecting error retrieving user")
	}

	user, err = store.GetByUserName(newUser2.UserName)
	if err == nil {
		t.Errorf("expecting error retrieving user")
	}

	user, err = store.Insert(newUser3)
	if err == nil {
		t.Errorf("expecting error when inserting invalid new user")
	}

	user, err = store.Insert(newUser)
	if err != nil {
		t.Errorf("error inserting new user: %v", err)
	}
	if user.Email == "" {
		t.Error("incorrectly inserting user into database")
	}

	user, err = store.GetByEmail(newUser.Email)
	if err != nil {
		t.Errorf("error getting user: %v", err)
	}
	if user.Email != newUser.Email {
		t.Errorf("incorrect user retrieved using email")
	}

	user, err = store.GetByUserName(newUser.UserName)
	if err != nil {
		t.Errorf("error getting user: %v", err)
	}
	if user.UserName != newUser.UserName {
		t.Errorf("incorrect user retrieved using username")
	}

	user, err = store.GetByID(user.ID)
	if err != nil {
		t.Errorf("error getting user: %v", err)
	}
	if user.Email != newUser.Email {
		t.Errorf("incorrect user retrieved using id")
	}

	err = store.Update(user.ID, updates)
	if err == nil {
		t.Errorf("can't update with names of 0 length")
	}

	updates.FirstName = "Eric"
	updates.LastName = "Eric"
	err = store.Update(user.ID, updates)
	if err != nil {
		t.Errorf("error updating user")
	}
	user, err = store.GetByEmail(newUser.Email)
	if err != nil {
		t.Errorf("error getting user: %v", err)
	}

	if strings.Compare(user.FirstName, updates.FirstName) == 1 ||
		strings.Compare(user.LastName, updates.LastName) == 1 {
		t.Errorf("incorrectly updating user")
	}

	err = store.Delete(user.ID)
	if err != nil {
		t.Errorf("error when deleting user: %v", err)
	}
}
