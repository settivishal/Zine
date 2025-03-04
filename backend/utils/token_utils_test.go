package utils

import (
	"testing"

	"encoding/hex"
)

func TestGenerateResetToken(t *testing.T) {
	tests := []struct {
		name    string
		wantErr bool
	}{
		{
			name:    "Generate a valid reset token",
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			resetToken := GenerateResetToken()

			// Check if the token is not empty
			if resetToken == "" {
				t.Fatalf("Expected non-empty reset token, got empty token")
			}

			// Check if the token has the correct length (32 bytes, encoded to 64 hex characters)
			if len(resetToken) != 64 {
				t.Fatalf("Expected reset token length of 64, got: %d", len(resetToken))
			}

			// Check if the token is a valid hex string
			if _, err := hex.DecodeString(resetToken); err != nil {
				t.Fatalf("Expected reset token to be a valid hex string, got error: %v", err)
			}

			t.Logf("Successfully generated reset token: %s", resetToken)
		})
	}
}
