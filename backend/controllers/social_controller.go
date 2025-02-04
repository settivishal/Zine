package controllers

import (
	"backend/utils"
	"context"
	"encoding/json"
	"io"
	"net/http"

	"backend/config"
	"backend/db"
	"backend/models"
	"backend/services"
)

// GoogleUser represents the user info obtained from Google
type GoogleUser struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Picture string `json:"picture"`
	Name    string `json:"name"`
}

// GoogleLogin redirects user to Google OAuth2 Login page
func GoogleLogin(w http.ResponseWriter, r *http.Request) {
	url := config.GoogleOauthConfig.AuthCodeURL("randomstate")
	// http.Redirect(w, r, url, http.StatusTemporaryRedirect)
	json.NewEncoder(w).Encode(map[string]string{
		"auth_url": url,
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
		utils.SendResponse(w, "Failed to exchange token", http.StatusInternalServerError)
		return
	}

	client := config.GoogleOauthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		http.Error(w, "Failed to get user info", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed to read user info", http.StatusInternalServerError)
		return
	}

	var google_user GoogleUser
	err = json.Unmarshal(body, &google_user)
	if err != nil {
		http.Error(w, "Failed to unmarshal user info", http.StatusInternalServerError)
		return
	}

	user := models.User{
		Email:      google_user.Email,
		Name:       google_user.Name,
		Picture:    google_user.Picture,
		OauthToken: google_user.ID,
	}

	if err := database.InsertUser(user); err != nil {
		utils.SendErrorResponse(w, "Error saving user", err, http.StatusInternalServerError)
		return
	}

	credentials := utils.Credentials{
		Email: user.Email,
		Name:  user.Name,
	}
	accessToken, accessExpiry, refreshToken := services.GenerateTokens(credentials, w)

	response := utils.LoginResponse{
		Message:      "Registration successful",
		Name:         google_user.Name,
		Email:        google_user.Email,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresAt:    accessExpiry,
	}

	utils.SendJSONResponse(w, response, http.StatusOK)
}
