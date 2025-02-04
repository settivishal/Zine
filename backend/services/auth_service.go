package services

import (
	"net/http"
	"time"
	"encoding/json"
	"errors"
	"log"
	"strings"

	"backend/db"
	"backend/utils"
	"backend/models"
)

// Return Access and Refesh Tokens
func GenerateTokens(credentials utils.Credentials, w http.ResponseWriter) (string, time.Time, string) {
	// Generate JWT Tokens
	accessToken, accessExpiry, err := utils.GenerateJWT(credentials.Email, "access_token", time.Minute*5)
	if err != nil {
		utils.SendErrorResponse(w, "Error generating access token", err, http.StatusInternalServerError)
	}

	refreshToken, _, err := utils.GenerateJWT(credentials.Email, "refresh_token", time.Hour*24*7)
	if err != nil {
		utils.SendErrorResponse(w, "Error generating refresh token", err, http.StatusInternalServerError)
	}

	return accessToken, accessExpiry, refreshToken
}

// HandleLogin processes user login and returns tokens
func HandleLogin(w http.ResponseWriter, r *http.Request) (*utils.LoginResponse, error, int) {
	// Parse request body
	var credentials utils.Credentials
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Fetch user from database
	user, err := database.GetUser(credentials.Email)
	if err != nil || !utils.CheckPasswordHash(credentials.Password, user.Password) {
		return nil, errors.New("Invalid credentials"), http.StatusUnauthorized
	}

	// Generate JWT tokens
	accessToken, accessExpiry, refreshToken := GenerateTokens(credentials, w)

	// Return structured response
	return &utils.LoginResponse{
		Message:      "Authentication successful",
		Name:         user.Name,
		Email:        user.Email,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresAt:    accessExpiry,
	}, nil, http.StatusOK
}

// HandleRegister processes user registration
func HandleRegister(r *http.Request) (*utils.RegisterResponse, error) {
	// Parse request body
	var credentials utils.Credentials
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		return nil, errors.New("invalid request format")
	}

	// Check if the email already exists
	if database.UserExists(credentials.Email) {
		return nil, errors.New("email already exists")
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(credentials.Password)
	if err != nil {
		return nil, err
	}

	// Save user in MongoDB
	user := models.User{
		Email:    credentials.Email,
		Password: hashedPassword,
		Name:     credentials.Name,
	}

	if err := database.InsertUser(user); err != nil {
		return nil, err
	}

	// Send onboarding email
	utils.SendEmail(credentials.Email)

	// Return structured response
	return &utils.RegisterResponse{
		Message: "Registration successful",
		Name:    credentials.Name,
		Email:   credentials.Email,
	}, nil
}

// HandleLogout processes user logout and invalidates the token
func HandleLogout(r *http.Request) error {
	// Get Authorization Header
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return errors.New("missing token")
	}

	tokenParts := strings.Split(authHeader, "Bearer ")
	if len(tokenParts) < 2 {
		return errors.New("invalid token format")
	}

	token := tokenParts[1]
	log.Println("Logging out user with token:", token)

	// Invalidate JWT Token
	err := utils.InvalidateJWT(token)
	if err != nil {
		return errors.New("Failed to invalidate token")
	}

	return nil
}
