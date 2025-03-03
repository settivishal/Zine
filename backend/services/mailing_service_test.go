package services

import (
	"testing"
)

func TestSendMailSimple(t *testing.T) {
	tests := []struct {
		name    string
		subject string
		html    string
		to      []string
	}{
		{
			name:    "Simple email",
			subject: "Test email",
			html:    "<p>This is a test</p>",
			to:      []string{"test@example.com"},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			SendMailSimple(test.subject, test.html, test.to)
		})
	}
}
