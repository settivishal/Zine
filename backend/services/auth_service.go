package services

import (
	"backend/utils"
	"net/http"
	"time"
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
