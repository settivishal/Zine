package controllers

import (
	"encoding/json"
	"backend/utils"
	"net/http"
)

func GetProfile(w http.ResponseWriter, r *http.Request) {
	Name, ok := r.Context().Value("name").(string)

	if !ok {
		utils.SendResponse(w, "Invalid or missing name in context", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Welcome, " + Name,
	})
}
