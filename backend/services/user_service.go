package services

import (
	"errors"
	"net/http"

	"backend/database"
	"backend/utils"

	"context"
	"encoding/json"
	"log"
	"os"

	"backend/services/awsservice"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
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
	Email, ok := r.Context().Value("email").(string)

	if !ok {
		return nil, errors.New("Error getting email"), http.StatusBadRequest
	}

	file, header, err := r.FormFile("image")
	if err != nil {
		return nil, errors.New("Error getting image"), http.StatusBadRequest
	}
	defer file.Close()

	// Initialize S3 and CloudFront clients
	// Load Variables from Environment
	AWS_ACCESS_KEY := os.Getenv("AWS_ACCESS_KEY")
	AWS_SECRET_ACCESS_KEY := os.Getenv("AWS_SECRET_ACCESS_KEY")
	AWS_REGION := os.Getenv("AWS_REGION")

	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion(AWS_REGION),
		config.WithCredentialsProvider(aws.NewCredentialsCache(credentials.NewStaticCredentialsProvider(AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, ""))),
	)
	if err != nil {
		log.Fatalf("Unable to load SDK config, %v", err)
	}

	s3Client := s3.NewFromConfig(cfg)
	S3_BUCKET_NAME := os.Getenv("S3_BUCKET_NAME")

	// Upload file to S3
	err = awsservice.UploadFileToS3(s3Client, S3_BUCKET_NAME, header.Filename, file)
	if err != nil {
		return nil, errors.New("Error uploading image to S3"), http.StatusInternalServerError
	}

	// Generate CloudFront URL
	cloudFrontDomain := os.Getenv("CLOUDFRONT_DOMAIN")
	cloudFrontURL := awsservice.GetCloudFrontURL(cloudFrontDomain, header.Filename)

	err = database.UpdateImage(Email, cloudFrontURL)
	if err != nil {
		return nil, errors.New("Error updating image in database"), http.StatusInternalServerError
	}

	return &utils.UpdateImageResponse{Message: "Image updated successfully", Image: cloudFrontURL}, nil, http.StatusOK
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
