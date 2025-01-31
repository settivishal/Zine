package controllers

import (
	"encoding/json"
	"net/http"
	"time"

	"backend/utils"
	"backend/config"

	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte(config.Env("JWT_SECRET_KEY"));

var users = map[string]string{
	"user1": "password1",
	"user2": "password2",
} //should be replaced with a database call

func Auth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	//Validate credentials
	var credentials utils.Credentials
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(utils.ErrorResponse{
			Message: "Invalid request format",
			Error:   err.Error(),
		})
		return
	}

	// Verify credentials (replace with database check)
	expectedPassword, ok := users[credentials.Username]
	if !ok || expectedPassword != credentials.Password {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(utils.Response{
			Message: "Invalid credentials",
		})
		return
	}

	//Generate access token
	accessTokenExpiry := time.Now().Add(time.Minute * 5)
	accessClaims := &utils.Claims{
		Username: credentials.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(accessTokenExpiry),
			Subject:   "access_token",
		},
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessTokenString, err := accessToken.SignedString(jwtKey)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(utils.ErrorResponse{
			Message: "Error generating access token",
			Error:   err.Error(),
		})
		return
	}

	//Generate refresh token with longer expiry
	refreshTokenExpiry := time.Now().Add(time.Hour * 24 * 7)
	refreshClaims := &utils.Claims{
		Username: credentials.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(refreshTokenExpiry),
			Subject:   "refresh_token",
		},
	}

	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshTokenString, err := refreshToken.SignedString(jwtKey)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(utils.ErrorResponse{
			Message: "Error generating refresh token",
			Error:   err.Error(),
		})
		return
	}

	//Return response with tokens and user info
	response := utils.Response{
		Message:      "Authentication successful",
		Username:     credentials.Username,
		AccessToken:  accessTokenString,
		RefreshToken: refreshTokenString,
		ExpiresAt:    accessTokenExpiry,
	}

	json.NewEncoder(w).Encode(response)
}
