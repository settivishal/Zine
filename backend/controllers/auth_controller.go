package controllers

import (
	"encoding/json"
	"net/http"

	"backend/config"
	"backend/services"
	"backend/utils"
)

var jwtKey = []byte(config.Env("JWT_SECRET_KEY", "2qqnlsrkKIxTP8dZtsJb1Ept2nbeOXbP"))

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

// ForgotPassword function to handle password reset requests

// @Summary Forgot Password
// @Description Sends a password reset link to the user's email
// @Tags users
// @Accept json
// @Produce json
// @Param request body utils.ForgotPasswordRequest true "Forgot Password Request"
// @Success 200 {object} utils.ForgotPasswordResponse "Password reset link sent"
// @Failure 400 {object} utils.ErrorResponse "Invalid request or email required"
// @Failure 400 {object} utils.ErrorResponse "Error resetting password"
// @Failure 405 {object} utils.ErrorResponse "Method not allowed"
// @Router /consumer/forgot_password [POST]
func ForgotPassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.SendResponse(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req utils.ForgotPasswordRequest
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
	err = services.HandleForgotPassword(req.Email)
	if err != nil {
		utils.SendErrorResponse(w, "Error resetting password", err, http.StatusBadRequest)
		return
	}

	response := utils.ForgotPasswordResponse{
		Message: "A password reset link has been sent",
	}

	// Always return the same message to prevent email enumeration
	utils.SendJSONResponse(w, response, http.StatusOK)
}

// ResetPassword function to handle password reset

// @Summary Reset Password
// @Description Resets the user's password using the provided token
// @Tags users
// @Accept json
// @Produce json
// @Param request body utils.ResetPasswordRequest true "Reset Password Request"
// @Success 200 {object} utils.ForgotPasswordResponse "Password has been reset successfully"
// @Failure 400 {object} utils.ErrorResponse "Invalid request or missing token/password"
// @Failure 400 {object} utils.ErrorResponse "Invalid or expired token"
// @Failure 405 {object} utils.ErrorResponse "Method not allowed"
// @Router /consumer/reset_password [POST]
func ResetPassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.SendResponse(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req utils.ResetPasswordRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		utils.SendErrorResponse(w, "Invalid request", err, http.StatusBadRequest)
		return
	}

	if req.Token == "" || req.Password == "" {
		utils.SendResponse(w, "Token and password are required", http.StatusBadRequest)
		return
	}

	// Process password reset
	err = services.HandleResetPassword(req.Token, req.Password)
	if err != nil {
		utils.SendErrorResponse(w, "Invalid or expired token", err, http.StatusBadRequest)
		return
	}

	response := utils.ForgotPasswordResponse{
		Message: "Password has been reset successfully",
	}

	utils.SendJSONResponse(w, response, http.StatusOK)
}
