package users

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"net/mail"
	"strings"

	"github.com/EJacobson96/Milestone/server/gateway/models/status"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/mgo.v2/bson"
)

const gravatarBasePhotoURL = "https://www.gravatar.com/avatar/"

var bcryptCost = 13

//User represents a user account in the database
type User struct {
	ID            bson.ObjectId   `json:"id" bson:"_id"`
	Email         string          `json:"email"`
	PassHash      []byte          `json:"-"` //stored, but not encoded to clients
	UserName      string          `json:"userName"`
	FirstName     string          `json:"firstName"`
	LastName      string          `json:"lastName"`
	PhotoURL      string          `json:"photoURL"`
	RaceEthnicity string          `json:"race_ethnicity"`
	Gender        string          `json:"gender"`
	DOB           string          `json:"dob"`
	Phone         []string        `json:"phone"`
	Facebook      string          `json:"facebook"`
	Organization  string          `json:"organization"`
	Program       string          `json:"program"`
	Availability  []*Availability `json:"availability"`
	//AreasOfExpertise 	[]*
	Connections []*User        `json:"connections"`
	AccountType string         `json:"account_type"`
	UserStatus  *status.Status `json:"user_status"`
	Address     *Address       `json:"address"`
}

//Credentials represents user sign-in credentials
type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

//NewUser represents a new user signing up for an account
type NewUser struct {
	Email         string          `json:"email"`
	Password      string          `json:"password"`
	PasswordConf  string          `json:"passwordConf"`
	UserName      string          `json:"userName"`
	FirstName     string          `json:"firstName"`
	LastName      string          `json:"lastName"`
	RaceEthnicity string          `json:"race_ethnicity"`
	Gender        string          `json:"gender"`
	DOB           string          `json:"dob"`
	Phone         []string        `json:"phone"`
	Facebook      string          `json:"facebook"`
	Organization  string          `json:"organization"`
	Program       string          `json:"program"`
	Availability  []*Availability `json:"availability"`
	//AreasOfExpertise 	[]*
	Connections []*User        `json:"connections"`
	AccountType string         `json:"account_type"`
	UserStatus  *status.Status `json:"user_status"`
	Address     *Address       `json:"address"`
}

//Updates represents allowed updates to a user profile
type Updates struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

//Validate validates the new user and returns an error if
//any of the validation rules fail, or nil if its valid
func (nu *NewUser) Validate() error {
	email, err := mail.ParseAddress(nu.Email)
	if err != nil {
		return fmt.Errorf("%v is an invalid email adress: %v", email, err)
	}
	if len(nu.Password) < 6 {
		return fmt.Errorf("password must be at least 6 characters")
	}
	if nu.Password != nu.PasswordConf {
		return fmt.Errorf("password and passwordconf must match")
	}
	if len(nu.UserName) == 0 {
		return fmt.Errorf("username must be non-zero length")
	}
	return nil
}

//ToUser converts the NewUser to a User, setting the
//PhotoURL and PassHash fields appropriately
func (nu *NewUser) ToUser() (*User, error) {
	err := nu.Validate()
	if err != nil {
		return nil, fmt.Errorf("error validating new user")
	}
	user := &User{}
	user.FirstName = nu.FirstName
	user.LastName = nu.LastName
	user.UserName = nu.UserName
	user.Email = nu.Email
	hash := strings.TrimSpace(nu.Email)
	hash = strings.ToLower(hash)
	h := md5.New()
	_, err = h.Write([]byte(hash))
	if err != nil {
		return user, fmt.Errorf("error writing bytes: %v", err)
	}
	hashResult := h.Sum(nil)
	user.PhotoURL = gravatarBasePhotoURL + hex.EncodeToString(hashResult)

	user.ID = bson.NewObjectId()

	user.SetPassword(nu.Password)
	return user, nil
}

//FullName returns the user's full name, in the form:
// "<FirstName> <LastName>"
//If either first or last name is an empty string, no
//space is put betweeen the names
func (u *User) FullName() string {
	return strings.TrimSpace(u.FirstName + " " + u.LastName)

}

//SetPassword hashes the password and stores it in the PassHash field
func (u *User) SetPassword(password string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), 13)
	if err != nil {
		return fmt.Errorf("error generating bcrypt hash: %v", err)
	}
	u.PassHash = hash
	return nil
}

//Authenticate compares the plaintext password against the stored hash
//and returns an error if they don't match, or nil if they do
func (u *User) Authenticate(password string) error {
	if err := bcrypt.CompareHashAndPassword(u.PassHash, []byte(password)); err != nil {
		return fmt.Errorf("password doesn't match stored hash")
	}
	return nil
}

//ApplyUpdates applies the updates to the user. An error
//is returned if the updates are invalid
func (u *User) ApplyUpdates(updates *Updates) error {
	if len(updates.FirstName) == 0 || len(updates.LastName) == 0 {
		return fmt.Errorf("FirstName must be non-zero-length")
	}
	u.FirstName = updates.FirstName
	u.LastName = updates.LastName
	return nil
}
