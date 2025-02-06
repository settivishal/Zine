package controllers

import (
	"net/http"

	"backend/db"
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
	Email, ok := r.Context().Value("email").(string)

	if !ok {
		utils.SendResponse(w, "Error getting email", http.StatusInternalServerError)
		return
	}

	user, err := database.GetUser(Email)

	if err != nil {
		utils.SendErrorResponse(w, "Error getting user with email: "+Email, err, http.StatusInternalServerError)
		return
	}

	response := utils.RegisterResponse{
		Message: "Welcome, " + user.Name,
		Name:    user.Name,
		Email:   user.Email,
	}

	utils.SendJSONResponse(w, response, http.StatusOK)
}
