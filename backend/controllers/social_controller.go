package controllers

import (
	"net/http"
	"fmt"

	"backend/services"
	"backend/utils"
)

// GoogleLogin redirects user to Google OAuth2 Login page

// @Summary Google Login
// @Description Google login function returns redirect url
// @Tags users
// @Produce json
// @Success 200
// @Router /auth/google [GET]
func GoogleLogin(w http.ResponseWriter, r *http.Request) {
	url, err := services.GetGoogleAuthURL()

	if err != nil {
		utils.SendErrorResponse(w, "Failed to generate random state", err, http.StatusInternalServerError)
		return
	}

	response := map[string]string{"auth_url": url}

	utils.SendJSONResponse(w, response, http.StatusOK)
}

// GoogleCallback handles the callback from Google OAuth2
func GoogleCallback(w http.ResponseWriter, r *http.Request) {
	response, status, err := services.HandleGoogleCallback(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Google authentication failed", err, status)
		return
	}

	// utils.SendJSONResponse(w, response, status)

	// Redirect to frontend with tokens
	frontendURL := "http://localhost:3000"
	redirectURL := fmt.Sprintf(
		"%s/auth-success?access_token=%s&refresh_token=%s", 
		frontendURL,
		response.AccessToken,
		response.RefreshToken,
	)

	http.Redirect(w, r, redirectURL, http.StatusTemporaryRedirect)
}
