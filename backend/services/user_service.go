package services

import (
	"net/http"
	"errors"

	"backend/utils"
	"backend/db"
)

func HandleProfile(w http.ResponseWriter, r *http.Request) (*utils.RegisterResponse, error, int) {
	Email, ok := r.Context().Value("email").(string)

	if !ok {
		return nil, errors.New("Error getting email"), http.StatusBadRequest
	}

	user, err := database.GetUser(Email)

	if err != nil {
		return nil, errors.New("Error getting user with email: "+Email), http.StatusBadRequest
	}

	return &utils.RegisterResponse{
		Message: "Welcome, " + user.Name,
		Name:    user.Name,
		Email:   user.Email,
	}, nil, http.StatusOK
}