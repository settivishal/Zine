package controllers

import (
	"net/http"

	"backend/services"
	"backend/utils"
)

// create a new tag
// @Summary Create Tag
// @Description Create a new tag
// @Tags tags
// @Accept json
// @Produce json
// @Param request body object{tag=string} true "Tag details"
// @Success 200 {object} utils.TagResponse
// @Failure 400 {object} utils.ErrorResponse "Invalid request format"
// @Failure 401 {object} utils.ErrorResponse "Unauthorized"
// @Failure 500 {object} utils.ErrorResponse "Error creating tag"
// @Failure 500 {object} utils.ErrorResponse "Internal server error"
// @Router /api/tags [POST]
func CreateTag(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleCreateTag(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Error creating tag", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)
}
