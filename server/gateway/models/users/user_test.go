package users

import (
	"testing"
)

//tests user validation
func TestValidate(t *testing.T) {
	// newUser := &NewUser{
	// 	Email:        "kangaroo@jupiter.com",
	// 	Password:     "secret",
	// 	PasswordConf: "secret",
	// 	FirstName:    "Kanga",
	// 	LastName:     "Roo",
	// }
	// if err := newUser.Validate(); err != nil {
	// 	t.Errorf("user was validated incorrectly: %v", err)
	// }
	// newUser.Email = "kangaroojupiter.com"
	// if err := newUser.Validate(); err == nil {
	// 	t.Error("expected error when validating email")
	// }
	// newUser.Email = "kangaroo@jupiter.com"
	// newUser.Password = "123456"
	// if err := newUser.Validate(); err == nil {
	// 	t.Error("expected error when comparing password and passwordconf")
	// }
	// newUser.Password = "1234"
	// if err := newUser.Validate(); err == nil {
	// 	t.Error("expected error when checking password length")
	// }
	// newUser.Password = "secret"
	// newUser.UserName = ""
	// if err := newUser.Validate(); err == nil {
	// 	t.Error("expected error if username has a 0 length")
	// }
}

func TestToUser(t *testing.T) {
	// newUser := &NewUser{
	// 	Email:        "kangaroo@jupiter.com",
	// 	FirstName:    "Bob",
	// 	LastName:     "Bobson",
	// 	Password:     "secret",
	// 	PasswordConf: "secret",
	// }
	// h := md5.New()
	// _, err := h.Write([]byte(newUser.Email))
	// if err != nil {
	// 	t.Errorf("error writing bytes: %v", err)
	// }
	// hashResult := h.Sum(nil)
	// nu, err := newUser.ToUser()
	// if err != nil {
	// 	t.Errorf("error returning user information: %v", err)
	// }
	// if nu.PhotoURL != gravatarBasePhotoURL+hex.EncodeToString(hashResult) {
	// 	t.Errorf("error setting gravatar")
	// }
	// hash, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), 13)
	// if err != nil {
	// 	t.Errorf("error generating bcrypt hash: %v", err)
	// }
	// if bytes.Equal(hash, nu.PassHash) {
	// 	t.Errorf("error hashing password")
	// }
}

func TestFullName(t *testing.T) {
	// user := &User{
	// 	FirstName: "Yuliya",
	// 	LastName:  "Krav",
	// }

	// name := user.FullName()
	// if name != "Yuliya Krav" {
	// 	t.Error("return invalid Full Name")
	// }
	// user.FirstName = ""
	// name = user.FullName()
	// if name != "Krav" {
	// 	t.Error("return invalid Full Name")
	// }
	// user.LastName = ""
	// name = user.FullName()
	// if name != "" {
	// 	t.Error("return invalid Full Name")
	// }
	// user.FirstName = "Yuliya"
	// name = user.FullName()
	// if name != "Yuliya" {
	// 	t.Error("return invalid Full Name")
	// }
}

func TestAuthenticate(t *testing.T) {
	// newUser := &NewUser{
	// 	Email:        "kangaroo@jupiter.com",
	// 	Password:     "secret",
	// 	PasswordConf: "secret",
	// 	FirstName:    "Bob",
	// 	LastName:     "Bobson",
	// }

	// nu, err := newUser.ToUser()
	// if err != nil {
	// 	t.Errorf("error returning user information: %v", err)
	// }
	// err = nu.Authenticate("secret")
	// if err != nil {
	// 	t.Errorf("error authenticating hash")
	// }
	// err = nu.Authenticate("food")
	// if err == nil {
	// 	t.Errorf("error authenticating hash")
	// }
}

func TestApplyUpdates(t *testing.T) {
	// updates := &Updates{
	// 	FirstName: "",
	// 	LastName:  "",
	// }

	// user := &User{
	// 	FirstName: "Sally",
	// 	LastName:  "Fields",
	// }

	// err := user.ApplyUpdates(updates)
	// if err == nil {
	// 	t.Errorf("expected error when applying updates")
	// }
	// updates.FirstName = "Billy"
	// updates.LastName = "Bob"
	// err = user.ApplyUpdates(updates)
	// if err != nil {
	// 	t.Errorf("error expecting updates: %v", err)
	// }
	// if user.FirstName != updates.FirstName || user.LastName != updates.LastName {
	// 	t.Errorf("not updating names correctly")
	// }

}
