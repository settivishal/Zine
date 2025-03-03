package utils

import (
	"testing"
	"time"
)

func TestGenerateJWT(t *testing.T) {
	tests := []struct {
		name    string
		email   string
		subject string
		expiry  time.Duration
		wantErr bool
	}{
		{
			name:    "Valid email and subject with 1 hour expiry",
			email:   "test@example.com",
			subject: "user123",
			expiry:  time.Hour,
			wantErr: false,
		},
		{
			name:    "Valid email and subject with 0 second expiry",
			email:   "test@example.com",
			subject: "user123",
			expiry:  0,
			wantErr: false,
		},
		{
			name:    "Empty email with 1 hour expiry",
			email:   "",
			subject: "user123",
			expiry:  time.Hour,
			wantErr: false,
		},
		{
			name:    "Valid email with empty subject and 1 hour expiry",
			email:   "test@example.com",
			subject: "",
			expiry:  time.Hour,
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			token, expirationTime, err := GenerateJWT(tt.email, tt.subject, tt.expiry)

			if (err != nil) != tt.wantErr {
				print(err.Error())
				t.Fatalf("GenerateJWT() returned an error: %v", err)
			}

			// Check if the token is not empty
			if token == "" {
				t.Fatalf("Expected non-empty token, got empty token")
			}

			// Check if the expiration time is correct
			if expirationTime.Before(time.Now()) && expirationTime.Add(time.Millisecond*500).Before(time.Now()) {
				t.Fatalf("Expected expiration time to be in the future, got: %v", expirationTime)
			}

			t.Logf("Success, Generated JWT for email: %s, subject: %s, expiry: %v", tt.email, tt.subject, tt.expiry)
		})
	}
}

func TestValidateJWT(t *testing.T) {
	email := "test@example.com"
	subject := "user123"
	expiry := time.Hour

	token, _, err := GenerateJWT(email, subject, expiry)
	if err != nil {
		t.Fatalf("Failed to generate token: %v", err)
	}

	claims, err := ValidateJWT(token)
	if err != nil {
		t.Fatalf("ValidateJWT() returned an error: %v", err)
	}

	if claims.Email != email {
		t.Fatalf("Expected email %s, got %s", email, claims.Email)
	}

	if claims.Subject != subject {
		t.Fatalf("Expected subject %s, got %s", subject, claims.Subject)
	}
}
