package utils

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestSendErrorResponse(t *testing.T) {
	tests := []struct {
		name       string
		message    string
		err        error
		statusCode int
	}{
		{
			name:       "Basic error response",
			message:    "Test error",
			err:        nil,
			statusCode: http.StatusBadRequest,
		},
		{
			name:       "Error response with error message",
			message:    "Something went wrong",
			err:        errors.New("database connection failed"),
			statusCode: http.StatusInternalServerError,
		},
		{
			name:       "Error response with empty message",
			message:    "",
			err:        errors.New("missing parameters"),
			statusCode: http.StatusUnprocessableEntity,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			recorder := httptest.NewRecorder()
			SendErrorResponse(recorder, tt.message, tt.err, tt.statusCode)

			if recorder.Code != tt.statusCode {
				t.Fatalf("Expected status %d, got %d", tt.statusCode, recorder.Code)
			}

			body, _ := io.ReadAll(recorder.Body)
			var response map[string]interface{}
			json.Unmarshal(body, &response)

			if response["error"] != tt.message {
				t.Fatalf("Expected error message '%s', got '%s'", tt.message, response["error"])
			}

			t.Logf("Success, received expected error message: %s", tt.message)
		})
	}
}

func TestSendResponse(t *testing.T) {
	tests := []struct {
		name       string
		message    string
		statusCode int
	}{
		{
			name:       "Basic success response",
			message:    "Success",
			statusCode: http.StatusOK,
		},
		{
			name:       "Empty message response",
			message:    "",
			statusCode: http.StatusNoContent,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			recorder := httptest.NewRecorder()
			SendResponse(recorder, tt.message, tt.statusCode)

			if recorder.Code != tt.statusCode {
				t.Fatalf("Expected status %d, got %d", tt.statusCode, recorder.Code)
			}

			body, _ := io.ReadAll(recorder.Body)
			var response map[string]interface{}
			json.Unmarshal(body, &response)

			if response["error"] != tt.message {
				t.Fatalf("Expected message '%s', got '%s'", tt.message, response["error"])
			}

			t.Logf("Success, received expected message: %s", tt.message)
		})
	}
}

func TestSendJSONResponse(t *testing.T) {
	tests := []struct {
		name       string
		response   map[string]string
		statusCode int
	}{
		{
			name: "Basic JSON response",
			response: map[string]string{
				"message": "Hello, World!",
			},
			statusCode: http.StatusOK,
		},
		{
			name:       "Empty JSON response",
			response:   map[string]string{},
			statusCode: http.StatusNoContent,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			recorder := httptest.NewRecorder()
			SendJSONResponse(recorder, tt.response, tt.statusCode)

			if recorder.Code != tt.statusCode {
				t.Fatalf("Expected status %d, got %d", tt.statusCode, recorder.Code)
			}

			body, _ := io.ReadAll(recorder.Body)
			var response map[string]string
			json.Unmarshal(body, &response)

			if len(tt.response) > 0 && response["message"] != tt.response["message"] {
				t.Fatalf("Expected message '%s', got '%s'", tt.response["message"], response["message"])
			}

			t.Logf("Success, received expected JSON response")
		})
	}
}
