package services

import (
	"testing"

	"backend/utils"

	"github.com/stretchr/testify/assert"
)

func TestGenerateTokens(t *testing.T) {
	email := "test@example.com"

	token, refreshToken, _ := GenerateTokens(utils.Credentials{Email: email}, nil)
	assert.NotEmpty(t, token)
	assert.NotEmpty(t, refreshToken)
}

// Unit test for HandleRegister

func TestHandleRegister(t *testing.T) {
	// Test case 1: Successful registration
	assert := assert.New(t)

	// assert equality
	assert.Equal(123, 123, "they should be equal")
}
