package controllers

import (
	"net/http"

	"backend/services"
	"backend/utils"
)

// Get profile of user

// @Summary Get Profile
// @Description Get deatils of a user
// @Tags users
// @Produce json
// @Success 200 {object} utils.RegisterResponse
// @Router /api/profile [GET]
func GetProfile(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleProfile(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Error retrieving profile", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)
}

// Change password of user

// @Summary Change Password
// @Description Change password of a user
// @Tags users
// @Accept json
// @Produce json
// @Param request body object{email=string,password=string,new_password=string} true "Change password credentials"
// @Success 200 {object} utils.ChangePasswordResponse
// @Failure 400 {object} utils.ErrorResponse "Invalid request format"
// @Failure 401 {object} utils.ErrorResponse "Invalid credentials"
// @Failure 500 {object} utils.ErrorResponse "Error hashing password"
// @Failure 500 {object} utils.ErrorResponse "Error updating password"
// @Failure 500 {object} utils.ErrorResponse "Internal server error"
// @Router /api/password [POST]

func ChangePassword(w http.ResponseWriter, r *http.Request) {
	err, status := services.HandleChangePassword(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Error retrieving profile", err, status)
		return
	}

	response := utils.ChangePasswordResponse{
		Message: "Password changed successfully",
	}

	utils.SendJSONResponse(w, response, status)
}
