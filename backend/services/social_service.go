package services

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"fmt"

	"backend/config"
	"backend/db"
	"backend/models"
	"backend/utils"

	"go.mongodb.org/mongo-driver/bson"
)

// GetGoogleAuthURL returns the encrypted Google OAuth URL
func GetGoogleAuthURL() (string, error) {
	state, err := generateRandomState()
	if err != nil {
		return "", fmt.Errorf("failed to generate random state: %w", err)
	}

	url := config.GoogleOauthConfig.AuthCodeURL(state)

	return url, err
}

// generateRandomState creates a secure random string for the OAuth state
func generateRandomState() (string, error) {
	// Generate 16 random bytes (128 bits)
	bytes := make([]byte, 16)
	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}

	// Encode the bytes to a URL-safe base64 string
	state := base64.URLEncoding.EncodeToString(bytes)
	return state, nil
}

// HandleGoogleCallback handles the callback from Google OAuth2
func HandleGoogleCallback(w http.ResponseWriter, r *http.Request) (*utils.LoginResponse, error) {
	if err := r.URL.Query().Get("error"); err != "" {
		return nil, errors.New("Google authentication error: " + err)
	}
	code := r.URL.Query().Get("code")

	if code == "" {
		return nil, errors.New("No code found")
	}

	token, err := config.GoogleOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		return nil, err
	}

	client := config.GoogleOauthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var user utils.GoogleUser
	err = json.Unmarshal(body, &user)
	if err != nil {
		return nil, err
	}

	// Update ot Create User Data
	updateData := models.User{
		Email:      user.Email,
		Name:       user.Name,
		Image:      user.Picture,
		OauthToken: user.ID,
	}

	if err := database.UpsertUser("users", bson.M{"email": user.Email}, updateData); err != nil {
		return nil, err
	}

	// Generate Access and Refresh Tokens
	credentials := utils.Credentials{
		Email: user.Email,
		Name:  user.Name,
	}
	accessToken, accessExpiry, refreshToken := GenerateTokens(credentials, w)

	http.Redirect(w, r, "http://localhost:3000/home", http.StatusSeeOther)

	// Return structured response
	return &utils.LoginResponse{
		Message:      "Registration successful",
		Name:         user.Name,
		Email:        user.Email,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresAt:    accessExpiry,
	}, nil
}
