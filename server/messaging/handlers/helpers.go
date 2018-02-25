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
			if strings.Contains(strings.ToLower(message.TextBody), strings.TrimSpace(strings.ToLower(query))) {
				found = true
				i = len(conversation.Messages)
			}
		}
		if !found {
			for i := 0; i < len(conversation.Members); i++ {
				if strings.Contains(strings.ToLower(conversation.Members[i].FullName), strings.TrimSpace(strings.ToLower(query))) {
					found = true
					i = len(conversation.Members)
				}
			}
		}
		if found {
			filteredConversations = append(filteredConversations, conversation)
		}
	}
	return filteredConversations
}
