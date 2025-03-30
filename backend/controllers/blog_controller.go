package controllers

import (
	"net/http"

	"backend/services"
	"backend/utils"
)

// Get Blog
//	@Summary		Get Blog
//	@Description	Get a blog by ID
//	@Tags			blogs
//	@Accept			json
//	@Produce		json
//	@Param			_id	path		string	true	"Blog ID"
//	@Success		200	{object}	utils.TagResponse
//	@Failure		400	{object}	utils.ErrorResponse	"Invalid request format"
//	@Failure		401	{object}	utils.ErrorResponse	"Unauthorized"
//	@Failure		500	{object}	utils.ErrorResponse	"Error getting blog"
//	@Failure		500	{object}	utils.ErrorResponse	"Internal server error"
//	@Router			/api/blogs/{_id} [GET]

func GetBlog(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleGetBlog(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Error getting blog", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)
}

// Create a new blog
//	@Summary		Create Blog
//	@Description	Create a new blog
//	@Tags			blogs
//	@Accept			json
//	@Produce		json
//	@Param			request	body		object{date=string}	true	"Blog details"
//	@Success		200		{object}	utils.TagResponse
//	@Failure		400		{object}	utils.ErrorResponse	"Invalid request format"
//	@Failure		401		{object}	utils.ErrorResponse	"Unauthorized"
//	@Failure		500		{object}	utils.ErrorResponse	"Error creating blog"
//	@Failure		500		{object}	utils.ErrorResponse	"Internal server error"
//	@Router			/api/blog/create [POST]
func CreateBlog(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleCreateBlog(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Error creating blog", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)
}

// Save Blog Content
//	@Summary		Save Blog Content
//	@Description	Save the content in the blog
//	@Tags			blogs
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	utils.TagResponse
//	@Failure		400	{object}	utils.ErrorResponse	"Invalid request format"
//	@Failure		401	{object}	utils.ErrorResponse	"Unauthorized"
//	@Failure		500	{object}	utils.ErrorResponse	"Error saving blog"
//	@Failure		500	{object}	utils.ErrorResponse	"Internal server error"
//	@Router			/api/blogs/save [POST]

func SaveBlog(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleSaveBlog(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Error saving blog", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)
}

// Upload Cover Image
//	@Summary		Upload Cover Image
//	@Description	Upload a cover image for a blog
//	@Tags			blogs
//	@Accept			multipart/form-data
//	@Produce		json
//	@Param			image	formData	file	true	"Cover image"
//	@Success		200		{object}	utils.TagResponse
//	@Failure		400		{object}	utils.ErrorResponse	"Invalid request format"
//	@Failure		401		{object}	utils.ErrorResponse	"Unauthorized"
//	@Failure		500		{object}	utils.ErrorResponse	"Error uploading cover"
//	@Failure		500		{object}	utils.ErrorResponse	"Internal server error"
//	@Router			/api/cover/upload [POST]

func UploadCover(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleUploadCover(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Error uploading cover", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)
}

// Get Blogs for a specific user with pagination

//	@Summary		Get Blogs
//	@Description	Get a list of blogs for a specific user with pagination.
//	@Tags			blogs
//	@Accept			json
//	@Produce		json
//	@Param			page			query		int		false	"Page number"		default(1)
//	@Param			limit			query		int		false	"Limit per page"	default(10)
//	@Param			Authorization	header		string	true	"Bearer <token>"	
//	@Success		200				{object}	map[string]models.Blog
//	@Failure		400				{object}	utils.ErrorResponse
//	@Failure		500				{object}	utils.ErrorResponse
//	@Router			/api/blogs [get]
func GetBlogs(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleGetBlogs(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Error getting blogs", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)
}
