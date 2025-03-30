package controllers

import (
	"net/http"

	"backend/services"
	"backend/utils"
)

// create a new tag

//	@Summary		Create Tag
//	@Description	Create a new tag
//	@Tags			tags
//	@Accept			json
//	@Produce		json
//	@Param			request	body		object{tag=string}	true	"Tag details"
//	@Success		200		{object}	utils.TagResponse
//	@Failure		400		{object}	utils.ErrorResponse	"Invalid request format"
//	@Failure		401		{object}	utils.ErrorResponse	"Unauthorized"
//	@Failure		500		{object}	utils.ErrorResponse	"Error creating tag"
//	@Failure		500		{object}	utils.ErrorResponse	"Internal server error"
//	@Router			/api/tags [POST]
func CreateTag(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleCreateTag(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Error creating tag", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)
}

// delete a tag
// find the tag using the name

//	@Summary		Delete Tag
//	@Description	Delete a tag
//	@Tags			tags
//	@Accept			json
//	@Produce		json
//	@Param			request	body		object{tag=string}	true	"Tag details"
//	@Success		200		{object}	utils.TagResponse
//	@Failure		400		{object}	utils.ErrorResponse	"Invalid request format"
//	@Failure		401		{object}	utils.ErrorResponse	"Unauthorized"
//	@Failure		500		{object}	utils.ErrorResponse	"Error deleting tag"
//	@Failure		500		{object}	utils.ErrorResponse	"Internal server error"
//	@Router			/api/tags [DELETE]
func DeleteTag(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleDeleteTag(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Error deleting tag", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)
}

// Set Tag to a specific date with user_id, tag_name and date

//	@Summary		Set Tag
//	@Description	Set a tag to a specific date
//	@Tags			tags
//	@Accept			json
//	@Produce		json
//	@Param			request	body		object{user_id=string,text=string,date=string}	true	"Tag details"
//	@Success		200		{object}	utils.TagResponse
//	@Failure		400		{object}	utils.ErrorResponse	"Invalid request format"
//	@Failure		401		{object}	utils.ErrorResponse	"Unauthorized"
//	@Failure		500		{object}	utils.ErrorResponse	"Error setting tag"
//	@Failure		500		{object}	utils.ErrorResponse	"Internal server error"
//	@Router			/api/tags/set [POST]
func SetTag(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleSetTag(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Error setting tag", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)
}

// remove tag from a specific date

//	@Summary		Remove Tag
//	@Description	Remove a tag from a specific date
//	@Tags			tags
//	@Accept			json
//	@Produce		json
//	@Param			request	body		object{user_id=string,text=string,date=string}	true	"Tag details"
//	@Success		200		{object}	utils.TagResponse
//	@Failure		400		{object}	utils.ErrorResponse	"Invalid request format"
//	@Failure		401		{object}	utils.ErrorResponse	"Unauthorized"
//	@Failure		500		{object}	utils.ErrorResponse	"Error removing tag"
//	@Failure		500		{object}	utils.ErrorResponse	"Internal server error"
//	@Router			/api/tags/remove [POST]
func RemoveTag(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleRemoveTag(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Error removing tag", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)
}

// get all tags of an user

//	@Summary		Get Tags
//	@Description	Get all tags
//	@Tags			tags
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	[]utils.Tag
//	@Failure		401	{object}	utils.ErrorResponse	"Unauthorized"
//	@Failure		500	{object}	utils.ErrorResponse	"Internal server error"
//	@Router			/api/tags [GET]
func GetTags(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleGetTags(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Error getting tags", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)
}

// Get all tags by IDs

//	@Summary		Get Tags by IDs
//	@Description	Get a list of tags by their IDs. The tag IDs are provided in the body as an array.
//	@Tags			tags
//	@Accept			json
//	@Produce		json
//	@Param			Authorization	header		string		true	"Bearer <token>"
//	@Param			body			body		[]string	true	"Request body containing tag IDs"
//	@Success		200				{object}	map[string]models.Tag
//	@Failure		400				{object}	utils.ErrorResponse
//	@Failure		500				{object}	utils.ErrorResponse
//	@Router			/tags/getByIDs [post]
func GetTagsByIDs(w http.ResponseWriter, r *http.Request) {
	response, err, status := services.HandleGetTagsByIDs(w, r)
	if err != nil {
		utils.SendErrorResponse(w, "Error getting tags by ID", err, status)
		return
	}

	utils.SendJSONResponse(w, response, status)
}
