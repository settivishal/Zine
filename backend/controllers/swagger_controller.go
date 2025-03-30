package controllers

import (
	"encoding/json"
	"net/http"

	"backend/utils"
)

//	@Summary		API Documentation
//	@description	This is a test route
//	@Tags			test
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	utils.LogoutResponse
//	@Router			/api/v1/hello [GET]
func HelloHandler(w http.ResponseWriter, r *http.Request) {
	response := utils.LogoutResponse{Message: "Hello, World!"}
	json.NewEncoder(w).Encode(response)
}

func ServeSwaggerDocs(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "docs/swagger.yaml")
}
