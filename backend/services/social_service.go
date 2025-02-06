package services

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"

	"backend/config"
	"backend/db"
	"backend/utils"

	"go.mongodb.org/mongo-driver/bson"
)

// GetGoogleAuthURL returns the encrypted Google OAuth URL
func GetGoogleAuthURL() (string, error) {
	encryptionKey := []byte(config.Env("AES_GCM_SECRET_KEY"))
	url := config.GoogleOauthConfig.AuthCodeURL("randomstate")

	return utils.Encrypt(url, encryptionKey)
}

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
	updateData := bson.M{
		"email":       user.Email,
		"name":        user.Name,
		"picture":     user.Picture,
		"oauth_token": user.ID,
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
