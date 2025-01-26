package controllers

import (
	"net/http"

	"backend/models"
	"backend/utils"
)

func GetUsers(w http.ResponseWriter, r *http.Request) {
	users := []models.User{
		{ID: 1, Username: "user1", Email: "user1@example.com"},
		{ID: 2, Username: "user2", Email: "user2@example.com"},
	}

	utils.RespondJSON(w, http.StatusOK, users)
}
