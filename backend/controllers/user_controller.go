package controllers

import (
	"encoding/json"
	"net/http"
)

func GetProfile(w http.ResponseWriter, r *http.Request) {
	// username := r.Context().Value("username").(string)
	email := r.Context().Value("email").(string)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Welcome, " + email,
	})
}
