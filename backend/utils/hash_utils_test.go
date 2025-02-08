package utils

import (
	"testing"

	"golang.org/x/crypto/bcrypt"
)

func TestHashPassword(t *testing.T) {
	tests := []struct {
		name     string
		password string
		wantErr  bool
	}{
		{
			name:     "Valid password only letters",
			password: "password",
			wantErr:  false,
		},
		{
			name:     "Empty password",
			password: "",
			wantErr:  false,
		},
		{
			name:     "Valid password letters and numbers",
			password: "password12",
			wantErr:  false,
		},
		{
			name:     "Valid password only numbers",
			password: "123456789",
			wantErr:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			hashedPassword, err := HashPassword(tt.password)

			if (err != nil) != tt.wantErr {
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

// Helper function to hash passwords
func hashPasswordHelper(password string) string {
	hashed, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hashed)
}

func TestCheckPasswordHash(t *testing.T) {
	tests := []struct {
		name     string
		password string
		hash     string
		want     bool
	}{
		{
			name:     "Valid password",
			password: "password1",
			hash:     hashPasswordHelper("password1"),
			want:     true,
		},
		{
			name:     "Invalid password",
			password: "password2",
			hash:     hashPasswordHelper("password1"),
			want:     false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			match := CheckPasswordHash(tt.password, tt.hash)
			if match != tt.want {
				t.Errorf("CheckPasswordHash() = %v, want %v", match, tt.want)
			}
		})
	}
}
