package controllers

import (
	"net/http"

	"backend/config"
	"backend/utils"
	"backend/services"
)

var jwtKey = []byte(config.Env("JWT_SECRET_KEY", "2qqnlsrkKIxTP8dZtsJb1Ept2nbeOXbP"))

// Login handles user authentication
func Login(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleLogin(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Authentication failed", err, status)
		return
	}

	utils.SendJSONResponse(w, response, http.StatusOK)
}

// Register function
func Register(w http.ResponseWriter, r *http.Request) {
	response, err := services.HandleRegister(r)
	if err != nil {
		utils.SendErrorResponse(w, "Registration failed", err, http.StatusInternalServerError)
		return
	}

	utils.SendJSONResponse(w, response, http.StatusOK)
}

// Logout function to handle user logout
func Logout(w http.ResponseWriter, r *http.Request) {
	err := services.HandleLogout(r)
	if err != nil {
		utils.SendErrorResponse(w, "Failed to logout", err, http.StatusInternalServerError)
		return
	}

	// Send a successful logout response
	response := utils.LogoutResponse{
		Message: "Logout successful",
	}

	utils.SendJSONResponse(w, response, http.StatusOK)
}
