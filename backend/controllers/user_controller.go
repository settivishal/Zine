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
