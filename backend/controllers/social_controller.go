package controllers

import (
	"encoding/json"
	"net/http"

	"backend/utils"
	"backend/services"
)

// GoogleLogin redirects user to Google OAuth2 Login page
func GoogleLogin(w http.ResponseWriter, r *http.Request) {
	url, err := services.GetGoogleAuthURL()

	if err != nil {
		utils.SendErrorResponse(w, "Encryption error", err, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"auth_url": url,
	})
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
