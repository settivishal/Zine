package controllers

import (
	// "encoding/json"
	"net/http"

	"backend/utils"
	"backend/services"
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
	response, err := services.HandleGoogleCallback(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Google authentication failed", err, http.StatusInternalServerError)
		return
	}

	utils.SendJSONResponse(w, response, http.StatusOK)
}
