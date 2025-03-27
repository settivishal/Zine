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

// Update Image of an user, received as a file

// @Summary Update Image
// @Description Update image of a user
// @Tags users
// @Accept json
// @Produce json
// @Param image formData file true "Image file"
// @Success 200 {object} utils.RegisterResponse
// @Failure 400 {object} utils.ErrorResponse "Invalid request format"
// @Failure 401 {object} utils.ErrorResponse "Invalid credentials"
// @Failure 500 {object} utils.ErrorResponse "Error updating image"
// @Failure 500 {object} utils.ErrorResponse "Internal server error"
// @Router /api/image/update [POST]
func UpdateImage(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleUpdateImage(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Error updating image", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)
}

// Update Profile of an user

// @Summary Update Profile
// @Description Update profile of a user
// @Tags users
// @Accept json
// @Produce json
// @Param request body object{bio=string,age=string,gender=string} true "Profile details"
// @Success 200 {object} utils.RegisterResponse
// @Failure 400 {object} utils.ErrorResponse "Invalid request format"
// @Failure 401 {object} utils.ErrorResponse "Invalid credentials"
// @Failure 500 {object} utils.ErrorResponse "Error updating profile"
// @Failure 500 {object} utils.ErrorResponse "Internal server error"
// @Router /api/profile/update [POST]
func UpdateProfile(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleUpdateProfile(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Error updating profile", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)

}

// Update Hobbies of an user

// @Summary Update Hobbies
// @Description Update hobbies of a user
// @Tags users
// @Accept json
// @Produce json
// @Param request body object{hobbies=[]string} true "Hobbies details"
// @Success 200 {object} utils.RegisterResponse
// @Failure 400 {object} utils.ErrorResponse "Invalid request format"
// @Failure 401 {object} utils.ErrorResponse "Invalid credentials"
// @Failure 500 {object} utils.ErrorResponse "Error updating hobbies"
// @Failure 500 {object} utils.ErrorResponse "Internal server error"
// @Router /api/hobbies/update [POST]
func UpdateHobbies(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleUpdateHobbies(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Error updating hobbies", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)

}

// Update Socials of the user

// @Summary Update Socials
// @Description Update socials of a user
// @Tags users
// @Accept json
// @Produce json
// @Param request body object{linkedin_url=string,twitter_url=string,reddit_url=string,instagram_url=string} true "Socials details"
// @Success 200 {object} utils.RegisterResponse
// @Failure 400 {object} utils.ErrorResponse "Invalid request format"
// @Failure 401 {object} utils.ErrorResponse "Invalid credentials"
// @Failure 500 {object} utils.ErrorResponse "Error updating socials"
// @Failure 500 {object} utils.ErrorResponse "Internal server error"
// @Router /api/socials/update [POST]
func UpdateSocials(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleUpdateSocials(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Error updating socials", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)

}
