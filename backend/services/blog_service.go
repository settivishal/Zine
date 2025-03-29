package services

import (
	"encoding/json"
	"errors"
	"net/http"

	"backend/database"
	"backend/models"
	"backend/utils"

	"backend/services/awsservice"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"

	"context"
	"log"
	"os"
	"strings"
)

// Handle Get Blog - _id is there in the query

func HandleGetBlog(w http.ResponseWriter, r *http.Request) (*utils.GetBlogResponse, error, int) {
	// Extract _id from the URL path parameters
	vars := r.URL.Path
	segments := strings.Split(vars, "/")
	if len(segments) < 4 || segments[3] == "" {
		return nil, errors.New("Blog ID is required"), http.StatusBadRequest
	}
	blogID := segments[3]

	// Fetch blog data from the database
	blog, err := database.GetBlog(blogID)

	if err != nil {
		return nil, errors.New("Error fetching blog data"), http.StatusInternalServerError
	}

	// Return structured response
	return &utils.GetBlogResponse{
		Message: "Blog fetched successfully",
		Blog:    blog,
	}, nil, http.StatusOK
}

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

// HandleUploadCover - Upload the cover image to s3

func HandleUploadCover(w http.ResponseWriter, r *http.Request) (*utils.UploadCoverResponse, error, int) {

	// Parse request body
	blogId := r.FormValue("blog_id")
	if blogId == "" {
		return nil, errors.New("Blog ID is required"), http.StatusBadRequest
	}

	// Get image from request
	file, header, err := r.FormFile("image")
	if err != nil {
		return nil, errors.New("Error getting image"), http.StatusBadRequest
	}
	defer file.Close()

	// Initialize S3 and CloudFront clients
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

	print(cloudFrontURL)

	err = database.UploadCover(blogId, cloudFrontURL)

	if err != nil {
		return nil, errors.New("Error updating image in database"), http.StatusInternalServerError
	}

	return &utils.UploadCoverResponse{
		Message: "Image uploaded successfully",
		Image:   cloudFrontURL,
	}, nil, http.StatusOK
}

func HandleGetBlogs(w http.ResponseWriter, r *http.Request) (map[string]models.Blog, error, int) {
	email, ok := r.Context().Value("email").(string)

	if !ok {
		return nil, errors.New("Error getting email"), http.StatusBadRequest
	}

	blogs, err := database.GetBlogs(email)

	if err != nil || len(blogs) == 0 {
		return nil, errors.New("No blogs found for this user"), http.StatusInternalServerError
	}

	blogMap := make(map[string]models.Blog)
	for _, blog := range blogs {
		blogMap[blog.Date] = blog
	}

	return blogMap, nil, http.StatusOK
}
