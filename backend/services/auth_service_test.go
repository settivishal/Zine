package services

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"backend/utils"
)

func TestGenerateTokens(t *testing.T) {
	email := "test@example.com"

	token, refreshToken, _ := GenerateTokens(utils.Credentials{Email: email}, nil)
	assert.NotEmpty(t, token)
	assert.NotEmpty(t, refreshToken)
}

// Unit test for HandleRegister
