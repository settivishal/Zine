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
	if err := database.InsertTag(tag.UserID, tag.Text, tag.Color); err != nil {
		return nil, errors.New("error creating tag"), http.StatusInternalServerError
	}

	// Return structured response
	return &utils.TagResponse{
		Message: "Tag created successfully",
	}, nil, http.StatusOK
}

// HandleDeleteTag deletes a tag
func HandleDeleteTag(w http.ResponseWriter, r *http.Request) (*utils.TagResponse, error, int) {
	// Parse request body
	var tag utils.Tag
	if err := json.NewDecoder(r.Body).Decode(&tag); err != nil {
		return nil, errors.New(err.Error() + ": Invalid request format"), http.StatusBadRequest
	}

	// Delete tag from database
	if err := database.DeleteTag(tag.UserID, tag.Text); err != nil {
		return nil, errors.New("error deleting tag"), http.StatusInternalServerError
	}

	// Return structured response
	return &utils.TagResponse{
		Message: "Tag deleted successfully",
	}, nil, http.StatusOK
}

// HandleSetTag sets a tag to a specific date
func HandleSetTag(w http.ResponseWriter, r *http.Request) (*utils.TagResponse, error, int) {
	// Parse request body
	var tag utils.SetTag
	if err := json.NewDecoder(r.Body).Decode(&tag); err != nil {
		return nil, errors.New(err.Error() + ": Invalid request format"), http.StatusBadRequest
	}

	// Set tag in database
	if err := database.SetTag(tag.UserID, tag.Text, tag.Date); err != nil {
		return nil, errors.New("error setting tag"), http.StatusInternalServerError
	}

	// Return structured response
	return &utils.TagResponse{
		Message: "Tag set successfully",
	}, nil, http.StatusOK
}
