package services

import (
	"encoding/json"
	"errors"
	"net/http"

	database "backend/db"
	"backend/utils"
)

// HandleCreateTag creates a new tag
func HandleCreateTag(w http.ResponseWriter, r *http.Request) (*utils.TagResponse, error, int) {
	// Parse request body
	var tag utils.Tag
	if err := json.NewDecoder(r.Body).Decode(&tag); err != nil {
		return nil, errors.New(err.Error() + ": Invalid request format"), http.StatusBadRequest
	}

	// Create tag in database
	if err := database.InsertTag(tag.Text, tag.Color); err != nil {
		return nil, errors.New("error creating tag"), http.StatusInternalServerError
	}

	// Return structured response
	return &utils.TagResponse{
		Message: "Tag created successfully",
	}, nil, http.StatusOK
}
