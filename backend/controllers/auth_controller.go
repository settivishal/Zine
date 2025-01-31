package controllers

import (
	"encoding/json"
	"net/http"

	"backend/config"
	"backend/utils"
)

var jwtKey = []byte(config.Env("JWT_SECRET_KEY", "2qqnlsrkKIxTP8dZtsJb1Ept2nbeOXbP"))

// should be replaced with a database call
var users = map[string]string{
	"user1": "$2y$10$lP0oE3YZKQV77x0MeBmfWujZiH0TOpW8G/zZquqrEJPlDj/ILiOCO", // "password1" hashed
	"user2": "$2y$10$BA0PCJkhIDSIhkPcAZGoherzyxXxs9PzkobSsQY6htI5zPqWM7Zla", // "password2" hashed
}

func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Validate credentials
	var credentials utils.Credentials
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		utils.SendErrorResponse(w, "Invalid request format", err, http.StatusBadRequest)
		return
	}

	// Verify credentials (replace with database check)
	expectedPassword := users[credentials.Username]

	// Verify password
	if !utils.CheckPasswordHash(credentials.Password, expectedPassword) {
		utils.SendResponse(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Generate JWT Tokens
	accessToken, accessExpiry, refreshToken := utils.GenerateTokens(credentials, w)

	// Return response
	response := utils.Response{
		Message:      "Authentication successful",
		Username:     credentials.Username,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresAt:    accessExpiry,
	}

	utils.SendJSONResponse(w, response, http.StatusOK)
}

func Register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Validate credentials
	var credentials utils.Credentials
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		utils.SendErrorResponse(w, "Invalid request format", err, http.StatusBadRequest)
		return
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(credentials.Password)
	if err != nil {
		utils.SendErrorResponse(w, "Error hashing password", err, http.StatusInternalServerError)
		return
	}

	// Save user (replace with database save)
	users[credentials.Username] = hashedPassword

	// Generate JWT Tokens
	accessToken, accessExpiry, refreshToken := utils.GenerateTokens(credentials, w)

	// Return response
	response := utils.Response{
		Message:      "Registration successful",
		Username:     credentials.Username,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresAt:    accessExpiry,
	}

	utils.SendJSONResponse(w, response, http.StatusOK)
}

// // Authenticate checks JWT token validity (handled via middleware)
// func Authenticate(w http.ResponseWriter, r *http.Request) {
// 	username := r.Context().Value("username").(string)
// 	utils.SendJSONResponse(w, map[string]string{
// 		"message":  "Authenticated successfully",
// 		"username": username,
// 	}, http.StatusOK)
// }
