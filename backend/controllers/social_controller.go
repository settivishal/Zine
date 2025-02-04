package controllers

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	
	"backend/utils"
	"backend/config"
	"backend/db"
	"backend/services"

	"go.mongodb.org/mongo-driver/bson"
)

// GoogleLogin redirects user to Google OAuth2 Login page
func GoogleLogin(w http.ResponseWriter, r *http.Request) {
	var encryptionKey = []byte(config.Env("AES_GCM_SECRET_KEY"))

	url := config.GoogleOauthConfig.AuthCodeURL("randomstate")

	encryptedURL, err := utils.Encrypt(url, encryptionKey)
	if err != nil {
		utils.SendErrorResponse(w, "Encryption error", err, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"auth_url": encryptedURL,
	})
}

// GoogleCallback handles the callback from Google OAuth2
func GoogleCallback(w http.ResponseWriter, r *http.Request) {
	if err := r.URL.Query().Get("error"); err != "" {
		utils.SendResponse(w, "Google authentication error: "+err, http.StatusBadRequest)
		return
	}
	code := r.URL.Query().Get("code")

	if code == "" {
		utils.SendResponse(w, "No code found", http.StatusBadRequest)
		return
	}

	token, err := config.GoogleOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		utils.SendErrorResponse(w, "Failed to exchange token", err, http.StatusInternalServerError)
		return
	}

	client := config.GoogleOauthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		utils.SendErrorResponse(w, "Failed to get user info", err, http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		utils.SendErrorResponse(w, "Failed to read user info", err, http.StatusInternalServerError)
		return
	}

	var user utils.GoogleUser
	err = json.Unmarshal(body, &user)
	if err != nil {
		utils.SendErrorResponse(w, "Failed to unmarshal user info", err, http.StatusInternalServerError)
		return
	}

	// Update ot Create User Data
	updateData := bson.M{
		"email":       user.Email,
		"name":        user.Name,
		"picture":     user.Picture,
		"oauth_token": user.ID,
	}

	if err := database.UpsertUser("users", bson.M{"email": user.Email}, updateData); err != nil {
		utils.SendErrorResponse(w, "Error saving user", err, http.StatusInternalServerError)
		return
	}

	// Generate Access and Refresh Tokens
	credentials := utils.Credentials{
		Email: user.Email,
		Name:  user.Name,
	}
	accessToken, accessExpiry, refreshToken := services.GenerateTokens(credentials, w)

	// Response structure
	response := utils.LoginResponse{
		Message:      "Registration successful",
		Name:         user.Name,
		Email:        user.Email,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresAt:    accessExpiry,
	}

	utils.SendJSONResponse(w, response, http.StatusOK)
}
