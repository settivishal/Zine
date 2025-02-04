package utils

import (
	"encoding/json"
	"net/http"
)

// SendErrorResponse sends a JSON error response
func SendErrorResponse(w http.ResponseWriter, message string, err error, statusCode int) {
	w.WriteHeader(statusCode)

	response := map[string]interface{}{
		"error": message,
	}

	if err != nil {
		response["details"] = err.Error()
	}

	json.NewEncoder(w).Encode(response)
}

// SendResponse sends a JSON response with a message
func SendResponse(w http.ResponseWriter, message string, statusCode int) {
	w.WriteHeader(statusCode)

	response := map[string]interface{}{
		"error": message,
	}

	json.NewEncoder(w).Encode(response)
}

// SendJSONResponse sends a structured JSON response
func SendJSONResponse(w http.ResponseWriter, response interface{}, statusCode int) {
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}
