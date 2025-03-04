package utils

import (
	"crypto/rand"
	"encoding/hex"
)

// GenerateResetToken creates a secure random token
func GenerateResetToken() string {
	bytes := make([]byte, 32)
	_, err := rand.Read(bytes)
	if err != nil {
		panic(err)
	}
	return hex.EncodeToString(bytes)
}
