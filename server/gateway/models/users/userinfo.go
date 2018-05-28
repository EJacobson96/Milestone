package users

//Address represents a user's address in the database
type Address struct {
	AddressLine1 string `json:"addressLine1"`
	AddressLine2 string `json:"addressLine2"`
	City         string `json:"city"`
	State        string `json:"state"`
	Postal       string `json:"postal"`
}

//Availability represents a user's availability in the database
type Availability struct {
	Monday    string `json:"monday"`
	Tuesday   string `json:"tuesday"`
	Wednesday string `json:"wednesday"`
	Thursday  string `json:"thursday"`
	Friday    string `json:"friday"`
	Saturday  string `json:"saturday"`
	Sunday    string `json:"sunday"`
}

//Phone represents user's phone numbers in the database
type Phone struct {
	MobileNumber string `json:"mobileNumber"`
	WorkNumber   string `json:"workNumber"`
}
