package notifications

import "time"

type Notification struct {
	TimeSent    time.Time
	Read        bool
	Body        string
	ContentType string
}

type Request struct {
	TimeSent    time.Time
	Body        string
	ContentType string
}
