package services

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"
	"time"

	"backend/db"
	"backend/models"
	"backend/utils"

	"golang.org/x/crypto/bcrypt"
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
		return nil, errors.New(err.Error() + ": invalid request format"), http.StatusBadRequest
	}

	// Fetch user from database
	user, err := database.GetUser(credentials.Email)
	if err != nil {
		return nil, errors.New(err.Error() + ": invalid credentials"), http.StatusUnauthorized
	}

	// Verify password
	if !utils.CheckPasswordHash(credentials.Password, user.Password) {
		return nil, errors.New("invalid credentials"), http.StatusUnauthorized
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
func HandleRegister(r *http.Request) (*utils.RegisterResponse, error, int) {
	// Parse request body
	var credentials utils.Credentials
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		return nil, errors.New(err.Error() + ": Invalid request format"), http.StatusBadRequest
	}

	// Check if the email already exists
	if database.UserExists(credentials.Email) {
		return nil, errors.New("email already exists"), http.StatusConflict
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(credentials.Password)
	if err != nil {
		return nil, errors.New(err.Error() + ": Error hashing password"), http.StatusInternalServerError
	}

	// Save user in MongoDB
	user := models.User{
		Email:    credentials.Email,
		Password: hashedPassword,
		Name:     credentials.Name,
	}

	if err := database.InsertUser(user); err != nil {
		return nil, errors.New(err.Error() + ": Error saving user"), http.StatusInternalServerError
	}

	// send email
	SendMailSimple("Welcome to Zine!"+" "+credentials.Name, "<h1>Thank you for signing up!<h1> We are glad you joined us!", []string{credentials.Email})

	// Return structured response
	return &utils.RegisterResponse{
		Message: "Registration successful",
		Name:    credentials.Name,
		Email:   credentials.Email,
	}, nil, http.StatusOK
}

// HandleLogout processes user logout and invalidates the token
func HandleLogout(r *http.Request) (error, int) {
	// Get Authorization Header
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return errors.New("missing token"), http.StatusUnauthorized
	}

	tokenParts := strings.Split(authHeader, "Bearer ")
	if len(tokenParts) < 2 {
		return errors.New("invalid token format"), http.StatusUnauthorized
	}

	token := tokenParts[1]

	// Invalidate JWT Token
	err := utils.InvalidateJWT(token)
	if err != nil {
		return errors.New(err.Error() + ": Failed to logout"), http.StatusInternalServerError
	}

	return nil, http.StatusOK
}

func HandleChangePassword(w http.ResponseWriter, r *http.Request) (error, int) {
	// Parse request body
	var credentials utils.ChangePasswordCredentials
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		return errors.New("invalid request format"), http.StatusBadRequest
	}

	// Fetch user from database
	user, err := database.GetUser(credentials.Email)
	if err != nil {
		return errors.New("invalid credentials"), http.StatusUnauthorized
	}

	// Verify password
	if !utils.CheckPasswordHash(credentials.Password, user.Password) {
		return errors.New("invalid credentials"), http.StatusUnauthorized
	}

	// Hash new password
	hashedPassword, err := utils.HashPassword(credentials.NewPassword)
	if err != nil {
		return errors.New("error hashing password"), http.StatusInternalServerError
	}

	// log.Println("New Password", credentials.NewPassword)
	// log.Println("New Password Hashed", hashedPassword)
	// Update password in database
	if err := database.UpdatePassword(user.Email, hashedPassword); err != nil {
		return errors.New("error updating password"), http.StatusInternalServerError
	}

	return nil, http.StatusOK
}

// HandleForgotPassword handles forgot password requests
func HandleForgotPassword(email string) error {
	// Find user by email
	user, err := database.GetUser(email)
	if err != nil {
		// We don't reveal if the email exists
		return nil
	}
	
	// Generate a secure random token
	token, err := generateRandomToken(32)
	if err != nil {
		return err
	}
	
	// Store token in database
	err = database.CreatePasswordResetToken(user.ID, token)
	if err != nil {
		return err
	}
	
	// Send reset email
	resetURL := "http://localhost:3000/reset-password?token=" + token
	return SendPasswordResetEmail(user.Email, user.Name, resetURL)
}

// HandleResetPassword resets a user's password
func HandleResetPassword(token, newPassword string) error {
	// Validate the token
	resetToken, err := database.GetValidToken(token)
	if err != nil {
		return errors.New("invalid or expired token")
	}
	
	// Hash the new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	log.Println("resetToken.UserID: ", resetToken.UserID)
	
	// Update user's password
	err = database.UpdateUserPassword(resetToken.UserID, string(hashedPassword))
	if err != nil {
		return err
	}
	
	// Mark token as used
	return database.MarkTokenAsUsed(resetToken.ID)
}

// Generate a random token
func generateRandomToken(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}
