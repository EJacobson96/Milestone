package status

import (
	"time"
)

type Status struct {
	AccountStatus string    `json:"accountStatus"`
	InvitedOn     time.Time `json:"invitedOn"`
	InvitedBy     time.Time `json:"invitedBy"`
	StatusNote    string    `json:"statusNote"`
	CreatedOn     time.Time `json:"createdOn"`
	CreatedBy     string    `json:"createdBy"`
	ModifiedOn    time.Time `json:"modifiedOn"`
	ModifiedBy    string    `json:"modifiedBy"`
}
