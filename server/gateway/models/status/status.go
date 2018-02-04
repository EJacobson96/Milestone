package status

import (
	"time"
)

type Status struct {
	AccountStatus string
	InvitedOn     time.Time
	InvitedBy     time.Time
	StatusNote    string
	CreatedOn     time.Time
	CreatedBy     string
	ModifiedOn    time.Time
	ModifiedBy    string
}
