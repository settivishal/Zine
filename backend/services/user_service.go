package services

import (
	"errors"
	"net/http"

	database "backend/db"
	"backend/utils"
)

func HandleProfile(w http.ResponseWriter, r *http.Request) (*utils.UserInfoResponse, error, int) {
	Email, ok := r.Context().Value("email").(string)

	if !ok {
		return nil, errors.New("Error getting email"), http.StatusBadRequest
	}

	user, err := database.GetUser(Email)

	if err != nil {
		return nil, errors.New("Error getting user with email: " + Email), http.StatusBadRequest
	}

	return &utils.UserInfoResponse{
		Message: "Welcome, " + user.Name,
		Name:    user.Name,
		Email:   user.Email,
		Image:   user.Image,
		Bio:     user.Bio,
	}, nil, http.StatusOK
}
