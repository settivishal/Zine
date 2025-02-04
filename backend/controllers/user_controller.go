package controllers

import (
	"encoding/json"
	"net/http"

	"backend/db"
	"backend/utils"
)

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

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Welcome, " + user.Name,
	})
}
