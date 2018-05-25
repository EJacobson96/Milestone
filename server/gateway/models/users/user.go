package users

import (
	"bytes"
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"net/mail"
	"strings"
	"time"

	"github.com/EJacobson96/Milestone/server/gateway/models/status"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/mgo.v2/bson"
)

const gravatarBasePhotoURL = "https://www.gravatar.com/avatar/"

var bcryptCost = 13

//User represents a user account in the database
type User struct {
	ID              bson.ObjectId   `json:"id" bson:"_id"`
	Email           string          `json:"email"`
	PassHash        []byte          `json:"-"` //stored, but not encoded to clients
	FirstName       string          `json:"firstName"`
	LastName        string          `json:"lastName"`
	FullName        string          `json:"fullName"`
	PhotoURL        string          `json:"photoURL"`
	Image           bytes.Buffer    `json:"image"`
	RaceEthnicity   string          `json:"raceEthnicity"`
	Gender          string          `json:"gender"`
	DOB             string          `json:"dob"`
	Phone           []string        `json:"phone"`
	Facebook        string          `json:"facebook"`
	Organization    string          `json:"organization"`
	Program         string          `json:"program"`
	Availability    []*Availability `json:"availability"`
	Notifications   []*Notification `json:"notifications"`
	PendingRequests []*Request      `json:"pendingRequests"`
	Connections     []*ShortUser    `json:"connections"`
	AccountType     string          `json:"accountType"`
	UserStatus      *status.Status  `json:"userStatus"`
	Address         *Address        `json:"address"`
}

type ShortUser struct {
	ID        string `json:"id" bson:"_id"`
	Email     string `json:"email"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	FullName  string `json:"fullName"`
}

type Notification struct {
	Sender       string    `json:"sender"`
	TimeSent     time.Time `json:"timeSent"`
	Read         bool      `json:"read"`
	Body         string    `json:"body"`
	ContentType  string    `json:"contentType"`
	ContentRoute string    `json:"contentRoute"`
}

type Request struct {
	Sender      string    `json:"sender"`
	TimeSent    time.Time `json:"timeSent"`
	Type        string    `json:"type"`
	Body        string    `json:"body"`
	ContentType string    `json:"contentType"`
}

//Updates represents allowed updates to a user profile
type UpdateUser struct {
	Email     string       `json:"email"`
	FirstName string       `json:"firstName"`
	LastName  string       `json:"lastName"`
	FullName  string       `json:"fullName"`
	Image     bytes.Buffer `json:"image"`
}

type UpdateRequests struct {
	PendingRequests []*Request `json:"pendingRequests"`
}

type UpdateConnections struct {
	Connections []*ShortUser `json:"connections"`
}

type UpdateNotifications struct {
	Notifications []*Notification `json:"notifications"`
}

//NewUser represents a new user signing up for an account
type NewUser struct {
	Email         string          `json:"email"`
	Password      string          `json:"password"`
	PasswordConf  string          `json:"passwordConf"`
	FirstName     string          `json:"firstName"`
	LastName      string          `json:"lastName"`
	FullName      string          `json:"fullName"`
	RaceEthnicity string          `json:"raceEthnicity"`
	Gender        string          `json:"gender"`
	DOB           string          `json:"dob"`
	Phone         []string        `json:"phone"`
	Facebook      string          `json:"facebook"`
	Organization  string          `json:"organization"`
	Program       string          `json:"program"`
	Availability  []*Availability `json:"availability"`
	Connections   []*ShortUser    `json:"connections"`
	AccountType   string          `json:"accountType"`
	UserStatus    *status.Status  `json:"userStatus"`
	Address       *Address        `json:"address"`
}

//Credentials represents user sign-in credentials
type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
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
	user.AccountType = nu.AccountType
	user.RaceEthnicity = nu.RaceEthnicity
	user.Gender = nu.Gender
	user.DOB = nu.DOB
	user.Phone = nu.Phone
	user.Facebook = nu.Facebook
	user.Organization = nu.Organization
	user.Program = nu.Program
	user.Availability = nu.Availability
	user.Connections = nu.Connections
	user.UserStatus = nu.UserStatus
	user.Address = nu.Address
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
	user.FullName = user.GetFullName()
	user.SetPassword(nu.Password)
	return user, nil
}

//FullName returns the user's full name, in the form:
// "<FirstName> <LastName>"
//If either first or last name is an empty string, no
//space is put betweeen the names
func (u *User) GetFullName() string {
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
// func (u *User) ApplyUpdates(updates *Updates) error {
// 	if len(updates.FirstName) == 0 || len(updates.LastName) == 0 {
// 		return fmt.Errorf("FirstName must be non-zero-length")
// 	}
// 	u.FirstName = updates.FirstName
// 	u.LastName = updates.LastName
// 	return nil
// }
