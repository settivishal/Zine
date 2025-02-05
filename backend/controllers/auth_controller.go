package controllers

import (
	"log"
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
// @Success 200 {object} utils.LoginResponse
// @Router /consumer/login [post]
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
// @Success 200 {object} utils.RegisterResponse
// @Router /consumer/register [post]
func Register(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleRegister(r)
	log.Println(response, err, status)
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
// @Success 200 {object} utils.LogoutResponse
// @Router /consumer/logout [post]
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
