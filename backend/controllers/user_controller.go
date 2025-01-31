package controllers

import (
	"encoding/json"
	"net/http"
)

func GetProfile(w http.ResponseWriter, r *http.Request) {
	username := r.Context().Value("username").(string)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Welcome, " + username,
	})
}
