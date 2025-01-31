package utils

import (
	"github.com/golang-jwt/jwt/v5"
)

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

type Response struct {
	Message string `json:"message"`
	Token string `json:"token"`
}