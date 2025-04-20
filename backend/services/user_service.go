package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"backend/database"
	"backend/services/awsservice"
	"backend/utils"
)

func HandleProfile(w http.ResponseWriter, r *http.Request) (*utils.UserInfoResponse, error, int) {
	Email, ok := r.Context().Value("email").(string)

	if !ok {
		return nil, errors.New("Error getting email"), http.StatusBadRequest
	}

	user, err := database.GetUser(Email)

	if err != nil {
		return nil, errors.New("Error getting user with email: " + Email), http.StatusBadRequest
	}

	return &utils.UserInfoResponse{
		Message:      "Welcome, " + user.Name,
		Name:         user.Name,
		Email:        user.Email,
		Image:        user.Image,
		Bio:          user.Bio,
		Age:          user.Age,
		Gender:       user.Gender,
		Hobbies:      user.Hobbies,
		InstagramUrl: user.InstagramUrl,
		TwitterUrl:   user.TwitterUrl,
		RedditUrl:    user.RedditUrl,
		LinkedinUrl:  user.LinkedinUrl,
	}, nil, http.StatusOK
}

func HandleUpdateImage(w http.ResponseWriter, r *http.Request) (*utils.UpdateImageResponse, error, int) {
	email, ok := r.Context().Value("email").(string)

	if !ok {
		return nil, errors.New("Error getting email"), http.StatusBadRequest
	}

	user, err := database.GetUser(email)
	if err != nil || user.ID == "" {
		return nil, errors.New("User not found"), http.StatusBadRequest
	}

	userId := user.ID

	file, filename, err := r.FormFile("image")
	fmt.Println("filename: ", filename.Filename)
	if err != nil {
		return nil, errors.New("Error getting image"), http.StatusBadRequest
	}
	defer file.Close()

	ext := filepath.Ext(filename.Filename)
	if ext == "" {
		return nil, errors.New("file has no extension"), http.StatusBadRequest
	}

	s3Key := userId + ext
	fmt.Println("s3Key: ", s3Key)

	s3Client := awsservice.GetS3Client()
	S3_BUCKET_NAME := os.Getenv("S3_BUCKET_NAME")

	// // Delete old image from S3
	// err = awsservice.DeleteFileFromS3(s3Client, S3_BUCKET_NAME, s3Key)
	// if err != nil {
	// 	return nil, errors.New("Error deleting old image from S3"), http.StatusInternalServerError
	// }

	// Upload file to S3
	err = awsservice.UploadFileToS3(s3Client, S3_BUCKET_NAME, s3Key, file)
	if err != nil {
		return nil, errors.New("Error uploading image to S3"), http.StatusInternalServerError
	}

	// Generate CloudFront URL
	cloudFrontDomain := os.Getenv("CLOUDFRONT_DOMAIN")
	cloudFrontURL := awsservice.GetCloudFrontURL(cloudFrontDomain, s3Key)

	err = database.UpdateImage(email, cloudFrontURL)
	if err != nil {
		return nil, errors.New("Error updating image in database"), http.StatusInternalServerError
	}

	return &utils.UpdateImageResponse{Message: "Image updated successfully", Image: cloudFrontURL}, nil, http.StatusOK
}

func HandleDeleteProfileImage(w http.ResponseWriter, r *http.Request) (*utils.DeleteProfileImageResponse, error, int) {
	email, ok := r.Context().Value("email").(string)
	if !ok {
		return nil, errors.New("Error getting email"), http.StatusBadRequest
	}

	user, err := database.GetUser(email)
	if err != nil {
		return nil, errors.New("User not found"), http.StatusBadRequest
	}

	if user.ID == "" {
		return nil, errors.New("User not found"), http.StatusBadRequest
	}

	userId := user.ID

	// Initialize S3 client
	s3Client := awsservice.GetS3Client()
	S3_BUCKET_NAME := os.Getenv("S3_BUCKET_NAME")

	err = awsservice.DeleteFileFromS3(s3Client, S3_BUCKET_NAME, userId)
	if err != nil {
		return nil, errors.New("Error deleting image from S3"), http.StatusInternalServerError
	}

	err = database.DeleteCover(userId)
	if err != nil {
		return nil, errors.New("Error deleting image from database"), http.StatusInternalServerError
	}

	return &utils.DeleteProfileImageResponse{
		Message: "Image deleted successfully",
	}, nil, http.StatusOK
}

func HandleUpdateProfile(w http.ResponseWriter, r *http.Request) (*utils.UpdateProfileResponse, error, int) {
	Email, ok := r.Context().Value("email").(string)

	if !ok {
		return nil, errors.New("Error getting email"), http.StatusBadRequest
	}

	var Profile utils.UpdateProfileRequest

	err := json.NewDecoder(r.Body).Decode(&Profile)
	if err != nil {
		return nil, errors.New("Error decoding request body"), http.StatusBadRequest
	}

	err = database.UpdateProfile(Email, Profile)

	if err != nil {
		log.Printf("Error updating profile for email %s: %v", Email, err)
		return nil, errors.New("Error updating profile in database"), http.StatusInternalServerError
	}

	return &utils.UpdateProfileResponse{Message: "Profile updated successfully"}, nil, http.StatusOK
}

// HandleUpdateHobbies

func HandleUpdateHobbies(w http.ResponseWriter, r *http.Request) (*utils.UpdateProfileHobbiesResponse, error, int) {
	Email, ok := r.Context().Value("email").(string)

	if !ok {
		return nil, errors.New("Error getting email"), http.StatusBadRequest
	}

	var Request utils.UpdateProfileHobbiesRequest

	err := json.NewDecoder(r.Body).Decode(&Request)
	if err != nil {
		return nil, errors.New("Error decoding request body"), http.StatusBadRequest
	}

	err = database.UpdateHobbies(Email, Request.Hobbies)

	if err != nil {
		log.Printf("Error updating hobbies for email %s: %v", Email, err)
		return nil, errors.New("Error updating hobbies in database"), http.StatusInternalServerError
	}

	return &utils.UpdateProfileHobbiesResponse{Message: "Hobbies updated successfully"}, nil, http.StatusOK
}

func HandleUpdateSocials(w http.ResponseWriter, r *http.Request) (*utils.UpdateProfileSocialsResponse, error, int) {
	Email, ok := r.Context().Value("email").(string)

	if !ok {
		return nil, errors.New("Error getting email"), http.StatusBadRequest
	}

	var Socials utils.UpdateProfileSocialsRequest

	err := json.NewDecoder(r.Body).Decode(&Socials)
	if err != nil {
		return nil, errors.New("Error decoding request body"), http.StatusBadRequest
	}

	err = database.UpdateSocials(Email, Socials)

	if err != nil {
		log.Printf("Error updating socials for email %s: %v", Email, err)
		return nil, errors.New("Error updating socials in database"), http.StatusInternalServerError
	}

	return &utils.UpdateProfileSocialsResponse{Message: "Socials updated successfully"}, nil, http.StatusOK
}

func HandleGetGrid(w http.ResponseWriter, r *http.Request) (*utils.GetGridResponse, error, int) {
	Email, ok := r.Context().Value("email").(string)

	if !ok {
		return nil, errors.New("Error getting email"), http.StatusBadRequest
	}

	grid, err := database.GetGrid(Email)

	if err != nil {
		return nil, errors.New("Error getting grid"), http.StatusInternalServerError
	}

	return &utils.GetGridResponse{
		Message: "Grid fetched successfully",
		Grid:    grid,
	}, nil, http.StatusOK

}
