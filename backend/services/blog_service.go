package services

import (
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"strconv"
	"strings"

	"backend/database"
	// "backend/models"
	"backend/services/awsservice"
	"backend/utils"

	"github.com/gorilla/mux"
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
		return nil, errors.New("error creating blog: " + err.Error()), http.StatusInternalServerError
	}

	// update the grid with the date
	err = database.UpdateGrid(Email, Request.Date)

	if err != nil {
		return nil, errors.New("error updating grid: " + err.Error()), http.StatusInternalServerError
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
	file, _, err := r.FormFile("image")
	if err != nil {
		return nil, errors.New("Error getting image"), http.StatusBadRequest
	}
	defer file.Close()

	s3Client := awsservice.GetS3Client()
	S3_BUCKET_NAME := os.Getenv("S3_BUCKET_NAME")

	// Upload file to S3
	err = awsservice.UploadFileToS3(s3Client, S3_BUCKET_NAME, blogId, file)
	if err != nil {
		return nil, errors.New("Error uploading image to S3"), http.StatusInternalServerError
	}

	// Generate CloudFront URL
	cloudFrontDomain := os.Getenv("CLOUDFRONT_DOMAIN")
	cloudFrontURL := awsservice.GetCloudFrontURL(cloudFrontDomain, blogId)

	// print(cloudFrontURL)

	err = database.UploadCover(blogId, cloudFrontURL)

	if err != nil {
		return nil, errors.New("Error updating image in database"), http.StatusInternalServerError
	}

	return &utils.UploadCoverResponse{
		Message: "Image uploaded successfully",
		Image:   cloudFrontURL,
	}, nil, http.StatusOK
}

func HandleGetBlogs(w http.ResponseWriter, r *http.Request) (*utils.GetBlogsResponse, error, int) {
	email, ok := r.Context().Value("email").(string)

	if !ok {
		return nil, errors.New("Error getting email"), http.StatusBadRequest
	}

	// Extract query parameters for pagination
	query := r.URL.Query()
	page, err := strconv.Atoi(query.Get("page"))
	if err != nil || page < 1 {
		page = 1 // Default to first page
	}
	limit, err := strconv.Atoi(query.Get("limit"))
	if err != nil || limit < 1 {
		limit = 7 // Default page size
	}

	blogs, err, count, totalPages := database.GetBlogs(email, page, limit)
	if err != nil || len(blogs) == 0 {
		return nil, errors.New("No blogs found for this user"), http.StatusInternalServerError
	}

	blogResponses := make(map[string]utils.BlogResponse)
	for _, blog := range blogs {
		date := blog.Date
		blogResponses[date] = utils.BlogResponse{
			ID:     blog.ID,
			Title:  blog.Title,
			Cover:  blog.Cover,
			TagIDs: blog.TagIDs,
		}
	}

	return &utils.GetBlogsResponse{
		Message:    "Blogs fetched successfully",
		Blogs:      blogResponses,
		Count:      count,
		TotalPages: totalPages,
	}, nil, http.StatusOK
}

func HandleDeleteCover(w http.ResponseWriter, r *http.Request) (*utils.DeleteCoverResponse, error, int) {
	blogId := r.FormValue("blog_id")
	if blogId == "" {
		return nil, errors.New("Blog ID is required"), http.StatusBadRequest
	}

	// Initialize S3 client
	s3Client := awsservice.GetS3Client()
	S3_BUCKET_NAME := os.Getenv("S3_BUCKET_NAME")

	err := awsservice.DeleteFileFromS3(s3Client, S3_BUCKET_NAME, blogId)
	if err != nil {
		return nil, errors.New("Error deleting image from S3"), http.StatusInternalServerError
	}

	err = database.DeleteCover(blogId)
	if err != nil {
		return nil, errors.New("Error deleting image from database"), http.StatusInternalServerError
	}

	return &utils.DeleteCoverResponse{
		Message: "Image deleted successfully",
	}, nil, http.StatusOK
}

func HandleGetBlogByDate(w http.ResponseWriter, r *http.Request) (*utils.GetBlogsByDateResponse, error, int) {
	email, ok := r.Context().Value("email").(string)

	if !ok {
		return nil, errors.New("Error getting email"), http.StatusBadRequest
	}

	// Extract date from URL path
	vars := mux.Vars(r)
	date := vars["date"]
	if date == "" {
		return nil, errors.New("date is required in URL path"), http.StatusBadRequest
	}

	// Get blogs for the user on the specified date
	blog, err := database.GetBlogByDate(email, date)
	if err != nil {
		return nil, errors.New("Error fetching blog: " + err.Error()), http.StatusInternalServerError
	}

	var blogResponse *utils.BlogResponse
	returnMessage := "No Blog found for this date"

	if blog != nil {
		blogResponse = &utils.BlogResponse{
			ID:     blog.ID,
			Title:  blog.Title,
			Cover:  blog.Cover,
			TagIDs: blog.TagIDs,
		}

		returnMessage = "Blog fetched successfully"
	}

	return &utils.GetBlogsByDateResponse{
		Message: returnMessage,
		Blog:    blogResponse,
	}, nil, http.StatusOK
}

func HandleGetBlogsByTagIDs(w http.ResponseWriter, r *http.Request) (*utils.GetBlogsResponse, error, int) {
	email, ok := r.Context().Value("email").(string)

	if !ok {
		return nil, errors.New("Error getting email"), http.StatusBadRequest
	}

	var payload utils.TagsRequestPayload

	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		return nil, errors.New("error decoding request payload"), http.StatusBadRequest
	}

	if len(payload.TagIDs) == 0 {
		return nil, errors.New("At least one tag ID is required"), http.StatusBadRequest
	}

	// Get pagination parameters
	query := r.URL.Query()
	page, _ := strconv.Atoi(query.Get("page"))
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(query.Get("limit"))
	if limit < 1 {
		limit = 10 // Default page size
	}

	// Fetch blogs by tag IDs
	blogs, err, count, totalPages := database.GetBlogsByTagIDs(email, payload.TagIDs, page, limit)
	if err != nil {
		return nil, errors.New("Error fetching blog: " + err.Error()), http.StatusNotFound
	}

	blogResponse := make(map[string]utils.BlogResponse)
	returnMessage := "No Blogs found with these tags"

	if len(blogs) > 0 {
		for _, blog := range blogs {
			blogResponse[blog.Date] = utils.BlogResponse{
				ID:     blog.ID,
				Title:  blog.Title,
				Cover:  blog.Cover,
				TagIDs: blog.TagIDs,
			}
		}

		returnMessage = "Blogs fetched successfully"
	}

	return &utils.GetBlogsResponse{
		Message:    returnMessage,
		Blogs:      blogResponse,
		Count:      count,
		TotalPages: totalPages,
	}, nil, http.StatusOK
}

func HandleChangeVisibility(w http.ResponseWriter, r *http.Request) (*utils.ChangeVisibilityResponse, error, int) {
	// Extract email from context
	email, ok := r.Context().Value("email").(string)

	if !ok {
		return nil, errors.New("Error getting email"), http.StatusBadRequest
	}
	// Parse request body
	var Request utils.ChangeVisibilityRequest
	if err := json.NewDecoder(r.Body).Decode(&Request); err != nil {
		return nil, errors.New(err.Error() + ": Invalid request format"), http.StatusBadRequest
	}

	// Validate blog ID
	if Request.BlogID == "" {
		return nil, errors.New("Blog ID is required"), http.StatusBadRequest
	}

	// Change visibility in the database
	err := database.ChangeVisibility(Request)

	if err != nil {
		return nil, errors.New("Error changing visibility: " + err.Error()), http.StatusInternalServerError
	}

	// Send email notification that the blog visibility has changed
	err = SendVisibilityChangeEmail(email, Request.BlogID, Request.IsPublic)
	if err != nil {
		return nil, errors.New("Error sending email: " + err.Error()), http.StatusInternalServerError
	}

	// Send Email to Users who have got access to the blog
	for _, user := range Request.Users {
		err = SendBlogInvitationEmail(user, email, Request.BlogID)
		if err != nil {
			return nil, errors.New("Error sending email to user: " + err.Error()), http.StatusInternalServerError
		}
	}

	// Return structured response
	return &utils.ChangeVisibilityResponse{
		Message: "Visibility changed successfully",
	}, nil, http.StatusOK
}
