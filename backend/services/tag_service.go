package services

import (
	"encoding/json"
	"errors"
	"net/http"

	"backend/database"
	"backend/models"
	"backend/utils"
)

// HandleCreateTag creates a new tag
func HandleCreateTag(w http.ResponseWriter, r *http.Request) (*utils.TagResponse, error, int) {
	// Parse request body
	var tag utils.Tag
	if err := json.NewDecoder(r.Body).Decode(&tag); err != nil {
		return nil, errors.New(err.Error() + ": Invalid request format"), http.StatusBadRequest
	}

	Email := r.Context().Value("email").(string)

	// Create tag in database
	if err := database.InsertTag(Email, tag.Text, tag.Color); err != nil {
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

	Email := r.Context().Value("email").(string)

	// Delete tag from database
	if err := database.DeleteTag(Email, tag.Text); err != nil {
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

	Email := r.Context().Value("email").(string)

	// Set tag in database
	if err := database.SetTag(Email, tag.Text, tag.Date); err != nil {
		return nil, errors.New("error setting tag"), http.StatusInternalServerError
	}

	// Return structured response
	return &utils.TagResponse{
		Message: "Tag set successfully",
	}, nil, http.StatusOK
}

// HandleRemoveTag removes a tag from a specific date
func HandleRemoveTag(w http.ResponseWriter, r *http.Request) (*utils.TagResponse, error, int) {
	// Parse request body
	var tag utils.SetTag
	if err := json.NewDecoder(r.Body).Decode(&tag); err != nil {
		return nil, errors.New(err.Error() + ": Invalid request format"), http.StatusBadRequest
	}

	Email := r.Context().Value("email").(string)

	// Remove tag from database
	if err := database.RemoveTag(Email, tag.Text, tag.Date); err != nil {
		return nil, errors.New("error removing tag"), http.StatusInternalServerError
	}

	// Return structured response
	return &utils.TagResponse{
		Message: "Tag removed successfully",
	}, nil, http.StatusOK
}

// HandleGetTags retrieves all tags for a user
func HandleGetTags(w http.ResponseWriter, r *http.Request) ([]models.Tag, error, int) {
	// Get tags from database
	tags, err := database.GetTags(r.Context().Value("email").(string))
	if err != nil {
		return nil, errors.New("error getting tags"), http.StatusInternalServerError
	}

	// Return structured response
	return tags, nil, http.StatusOK
}
