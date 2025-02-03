package controllers

import (
	"encoding/json"
	"net/http"

	"backend/config"
	"backend/db"
	"backend/utils"

	"backend/models"
)

var jwtKey = []byte(config.Env("JWT_SECRET_KEY", "2qqnlsrkKIxTP8dZtsJb1Ept2nbeOXbP"))

// Login handles user authentication
func Login(w http.ResponseWriter, r *http.Request) {

	// Validate credentials
	var credentials utils.Credentials
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		utils.SendErrorResponse(w, "Invalid request format", err, http.StatusBadRequest)
		return
	}

	// Fetch user from database
	user, err := database.GetUser(credentials.Email)
	if err != nil {
		utils.SendErrorResponse(w, "Invalid credentials", err, http.StatusUnauthorized)
		return
	}

	// Verify password
	if !utils.CheckPasswordHash(credentials.Password, user.Password) {
		utils.SendErrorResponse(w, "Invalid credentials", nil, http.StatusUnauthorized)
		return
	}

	// Generate JWT Tokens
	accessToken, accessExpiry, refreshToken := utils.GenerateTokens(credentials, w)

	// Return response
	response := utils.LoginResponse{
		Message:      "Authentication successful",
		Name:         user.Name,
		Email:        user.Email,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresAt:    accessExpiry,
	}

	utils.SendJSONResponse(w, response, http.StatusOK)
}

func Register(w http.ResponseWriter, r *http.Request) {
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

	// Check if the email already exists
	if database.UserExists(credentials.Email) {
		utils.SendErrorResponse(w, "Email already exists", nil, http.StatusConflict)
		return
	}

	// Save user in MongoDB
	user := models.User{
		Email:    credentials.Email,
		Password: hashedPassword, // Store hashed password, not plain text
		Name:     credentials.Name,
	}

	if err := database.InsertUser(user); err != nil {
		utils.SendErrorResponse(w, "Error saving user", err, http.StatusInternalServerError)
		return
	}

	// Return response
	response := utils.RegisterResponse{
		Message: "Registration successful",
		Name:    credentials.Name,
		Email:   credentials.Email,
	}

	// Send Onboarding Email
	utils.SendEmail(credentials.Email)

	utils.SendJSONResponse(w, response, http.StatusOK)
}
