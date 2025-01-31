package utils

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"backend/config"
)

var jwtKey = []byte(config.Env("JWT_SECRET_KEY"))

// GenerateJWT creates a new JWT token with custom expiration and subject
func GenerateJWT(username, subject string, expiry time.Duration) (string, time.Time, error) {
	expirationTime := time.Now().Add(expiry)
	claims := &Claims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			Subject:   subject,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	return tokenString, expirationTime, err
}

// ValidateJWT verifies a JWT token and extracts claims
func ValidateJWT(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, err
	}

	return claims, nil
}

// Return Access and Refesh Tokens
func GenerateTokens(credentials Credentials, w http.ResponseWriter) (string, time.Time, string) {
	// Generate JWT Tokens
	accessToken, accessExpiry, err := GenerateJWT(credentials.Username, "access_token", time.Minute*5)
	if err != nil {
		SendErrorResponse(w, "Error generating access token", err, http.StatusInternalServerError)
	}

	refreshToken, _, err := GenerateJWT(credentials.Username, "refresh_token", time.Hour*24*7)
	if err != nil {
		SendErrorResponse(w, "Error generating refresh token", err, http.StatusInternalServerError)
	}

	return accessToken, accessExpiry, refreshToken
}

// SendErrorResponse sends a JSON error response
func SendErrorResponse(w http.ResponseWriter, message string, err error, statusCode int) {
	w.WriteHeader(statusCode)

	json.NewEncoder(w).Encode(map[string]string{
		"message": message,
		"error":   err.Error(),
	})
}

// SendResponse sends a JSON response with a message
func SendResponse(w http.ResponseWriter, message string, statusCode int) {
	w.WriteHeader(statusCode)

	json.NewEncoder(w).Encode(map[string]string{
		"message": message,
	})
}

// SendJSONResponse sends a structured JSON response
func SendJSONResponse(w http.ResponseWriter, response interface{}, statusCode int) {
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}
