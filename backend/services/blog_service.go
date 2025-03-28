package services

import (
	"encoding/json"
	"errors"
	"net/http"

	"backend/database"
	"backend/utils"
)

// Handle Create Blog

func HandleCreateBlog(w http.ResponseWriter, r *http.Request) (*utils.CreateBlogResponse, error, int) {
	Email, ok := r.Context().Value("email").(string)

	if !ok {
		return nil, errors.New("Error getting email"), http.StatusBadRequest
	}

	// Parse request body
	var Request utils.CreateBlogRequest
	if err := json.NewDecoder(r.Body).Decode(&Request); err != nil {
		return nil, errors.New(err.Error() + ": Invalid request format"), http.StatusBadRequest
	}

	blog_url, err := database.CreateBlog(Email, Request)

	// Create blog in database
	if err != nil {
		return nil, errors.New("error creating blog"), http.StatusInternalServerError
	}

	// Return structured response
	return &utils.CreateBlogResponse{
		Message: "Blog created successfully",
		BlogUrl: blog_url,
	}, nil, http.StatusOK
}

// HandleSaveBlog - Save the blog content to the database

func HandleSaveBlog(w http.ResponseWriter, r *http.Request) (*utils.SaveBlogContentResponse, error, int) {

	// Parse request body
	var Request utils.SaveBlogContentRequest
	if err := json.NewDecoder(r.Body).Decode(&Request); err != nil {
		return nil, errors.New(err.Error() + ": Invalid request format"), http.StatusBadRequest
	}

	// Save blog content to database
	if err := database.SaveBlogContent(Request); err != nil {
		return nil, errors.New("error saving blog"), http.StatusInternalServerError
	}

	// Return structured response
	return &utils.SaveBlogContentResponse{
		Message: "Blog saved successfully",
	}, nil, http.StatusOK
}
