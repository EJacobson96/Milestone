package handlers

import (
	"strings"

	"github.com/EJacobson96/Milestone/server/messaging/models/messages"
)

//filters list of conversations based on textbody and a user's fullname
func FilterConversations(conversations []*messages.Conversation, query string) []*messages.Conversation {
	filteredConversations := []*messages.Conversation{}
	for _, conversation := range conversations {
		found := false
		for i := 0; i < len(conversation.Messages); i++ {
			message := conversation.Messages[i]
			if strings.Contains(message.TextBody, query) {
				found = true
				i++
			}
		}
		if !found {
			for i := 0; i < len(conversation.Members); i++ {
				if strings.Contains(conversation.Members[i].FullName, query) {
					found = true
					i++
				}
			}
		} else {
			filteredConversations = append(filteredConversations, conversation)
		}
	}
	return filteredConversations
}
