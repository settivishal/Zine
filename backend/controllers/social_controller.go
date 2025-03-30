package controllers

import (
	"net/http"
	"fmt"
	"net/url"

	"backend/services"
	"backend/utils"
)

// GoogleLogin redirects user to Google OAuth2 Login page

//	@Summary		Google Login
//	@Description	Google login function returns redirect url
//	@Tags			users
//	@Produce		json
//	@Success		200
//	@Router			/auth/google [GET]
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
		message := "Google authentication failed"
		errorMessage := err.Error()

		// Construct the redirect URL with error details
		frontendURL := "http://localhost:3000"
		redirectURL := fmt.Sprintf(
			"%s/auth-success?status=error&message=%s&error_message=%s&code=%d",
			frontendURL,
			url.QueryEscape(message),
			url.QueryEscape(errorMessage),
			status,
		)

		// Redirect to the frontend with error details
		http.Redirect(w, r, redirectURL, http.StatusTemporaryRedirect)
		return
	}

	// utils.SendJSONResponse(w, response, status)
	
	// Prepare the message and user details
	message := response.Message
	name := response.Name
	email := response.Email
	accessToken := response.AccessToken
	refreshToken := response.RefreshToken
	expiresAt := response.ExpiresAt

	// Redirect to frontend with tokens
	frontendURL := "http://localhost:3000"
	redirectURL := fmt.Sprintf(
		"%s/auth-success?status=success&message=%s&name=%s&email=%s&access_token=%s&refresh_token=%s&expires_at=%s&code=%d",
		frontendURL,
		url.QueryEscape(message),
		url.QueryEscape(name),
		url.QueryEscape(email),
		accessToken,
		refreshToken,
		expiresAt,
		status,
	)

	http.Redirect(w, r, redirectURL, http.StatusTemporaryRedirect)
}
