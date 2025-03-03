package controllers

import (
	"net/http"
	"encoding/json"

	"backend/config"
	"backend/services"
	"backend/utils"
)

var jwtKey = []byte(config.Env("JWT_SECRET_KEY", "2qqnlsrkKIxTP8dZtsJb1Ept2nbeOXbP"))

type ForgotPasswordRequest struct {
	Email string `json:"email"`
}

// Login handles user authentication

// @Summary User Login
// @Description Login user with email and password
// @Tags users
// @Accept json
// @Produce json
// @Param request body object{email=string,password=string} true "User login credentials"
// @Success 200 {object} utils.LoginResponse "Authentication successful"
// @Failure 400 {object} utils.ErrorResponse "Invalid request format"
// @Failure 401 {object} utils.ErrorResponse "Invalid credentials"
// @Failure 500 {object} utils.ErrorResponse "Internal server error"
// @Router /consumer/login [POST]
func Login(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleLogin(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Authorization Failed", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)
}

// Register function

// @Summary User Login
// @Description Register user with email, password and other details
// @Tags users
// @Accept json
// @Produce json
// @Param request body object{email=string,password=string,name=string} true "User register credentials"
// @Success 200 {object} utils.RegisterResponse "Registration successful"
// @Failure 400 {object} utils.ErrorResponse "Invalid request format"
// @Failure 409 {object} utils.ErrorResponse "Email already exists"
// @Failure 500 {object} utils.ErrorResponse "Error hashing password"
// @Failure 500 {object} utils.ErrorResponse "Error saving user"
// @Failure 500 {object} utils.ErrorResponse "Internal server error"
// @Router /consumer/register [POST]
func Register(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleRegister(r)
	if err != nil {
		utils.SendErrorResponse(w, "Registration Failed", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)
}

// Logout function to handle user logout

// @Summary User Logout
// @Description Logout the user from application
// @Tags users
// @Accept json
// @Produce json
// @Param Authorization header string true "Authorization token" default(Bearer )
// @Success 200 {object} utils.LogoutResponse "Logout successful"
// @Failure 401 {object} utils.ErrorResponse "Missing token"
// @Failure 409 {object} utils.ErrorResponse "Invalid token format"
// @Failure 500 {object} utils.ErrorResponse "Failed to logout"
// @Failure 500 {object} utils.ErrorResponse "Internal server error"
// @Router /consumer/logout [POST]
func Logout(w http.ResponseWriter, r *http.Request) {
	err, status := services.HandleLogout(r)
	if err != nil {
		utils.SendErrorResponse(w, "Failed to logout", err, status)
		return
	}

	// Send a successful logout response
	response := utils.LogoutResponse{
		Message: "Logout successful",
	}

	utils.SendJSONResponse(w, response, status)
}

// ForgotPassword handles forgot password requests
func ForgotPassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ForgotPasswordRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		utils.SendErrorResponse(w, "Invalid request", err, http.StatusBadRequest)
		return
	}

	if req.Email == "" {
		utils.SendResponse(w, "Email is required", http.StatusBadRequest)
		return
	}

	// Process forgot password request
	err = services.InitiatePasswordReset(req.Email)

	response := utils.LogoutResponse{
		Message: "A password reset link has been sent",
	}

	// Always return the same message to prevent email enumeration
	utils.SendJSONResponse(w, response, http.StatusOK)
}
