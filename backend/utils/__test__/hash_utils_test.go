package __test__

import (
	"testing"

	"backend/utils"

	"golang.org/x/crypto/bcrypt"
)

func TestHashPassword(t *testing.T) {
	tests := []struct{
		password string
	}{
		{"password12"},
		{"123456789"},
		{"!@#$%^&*()"},
		{""},
	}

	for _, tt := range tests {
		t.Run(tt.password, func(t *testing.T){
			hashedPassword, err := utils.HashPassword(tt.password)

			if err != nil {
				t.Fatalf("HashPassword() returned an error: %v", err)
			}

			if hashedPassword == tt.password {
				t.Fatalf("Hashed password should not be the same as the original password")
			}

			err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(tt.password))
			if err != nil {
				t.Fatalf("bcrypt.CompareHashAndPassword() failed: %v", err)
			}

			t.Logf("Success, Testing password: %s, Hashed: %s", tt.password, hashedPassword)
		})
	}
}