package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Credentials struct {
	Name     string `json:"name"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type Claims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

type RegisterResponse struct {
	Message string `json:"message"`
	Email   string `json:"email"`
	Name    string `json:"name"`
}

type LoginResponse struct {
	Message      string    `json:"message"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	AccessToken  string    `json:"access_token"`
	RefreshToken string    `json:"refresh_token"`
	ExpiresAt    time.Time `json:"expires_at"`
}

type ErrorResponse struct {
	Message string `json:"message"`
	Error   string `json:"error"`
}

type GoogleUser struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Picture string `json:"picture"`
	Name    string `json:"name"`
}

type LogoutResponse struct {
	Message string `json:"message"`
}

// type MockRegisterResponse struct {
// 	UserID    string `json:"user_id"`
// 	Username  string `json:"username"`
// 	Email     string `json:"email"`
// 	FullName  string `json:"full_name"`
// 	CreatedAt string `json:"created_at"`
// }

// type MockErrorResponse struct {
// 	Error   string `json:"error"`
// 	Message string `json:"message"`
// }
