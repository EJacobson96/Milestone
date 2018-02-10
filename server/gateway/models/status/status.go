package status

import (
	"time"
)

type Status struct {
	AccountStatus string    `json:"account_status"`
	InvitedOn     time.Time `json:"invited_on"`
	InvitedBy     time.Time `json:"invited_by"`
	StatusNote    string    `json:"status_note"`
	CreatedOn     time.Time `json:"created_on"`
	CreatedBy     string    `json:"created_by"`
	ModifiedOn    time.Time `json:"modified_on"`
	ModifiedBy    string    `json:"modified_by"`
}
