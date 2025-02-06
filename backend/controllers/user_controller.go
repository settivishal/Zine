package controllers

import (
	"net/http"

	"backend/services"
	"backend/utils"
)

func GetProfile(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleProfile(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Error retrieving profile", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)
}
