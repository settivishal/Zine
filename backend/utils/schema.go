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
type UserInfoResponse struct {
	Message string `json:"message"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Image   string `json:"image"`
	Bio     string `json:"bio"`
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

type ChangePasswordCredentials struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	NewPassword string `json:"new_password"`
}

type ChangePasswordResponse struct {
	Message string `json:"message"`
}

type Tag struct {
	Text  string `json:"text"`
	Color string `json:"color"`
}

type TagResponse struct {
	Message string `json:"message"`
}

type SetTag struct {
	Text string `json:"text"`
	Date string `json:"date"`
}
