package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

type RegisterResponse struct {
	Message  string `json:"message"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

type LoginResponse struct {
	Message      string    `json:"message"`
	Username     string    `json:"username"`
	AccessToken  string    `json:"access_token"`
	RefreshToken string    `json:"refresh_token"`
	ExpiresAt    time.Time `json:"expires_at"`
}

type ErrorResponse struct {
	Message string `json:"message"`
	Error   string `json:"error"`
}
