package controllers

import (
	"encoding/json"
	"net/http"
	"io"
	"net/http/httptest"

	"testing"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/assert"
)

type MockHelloHandler struct {
	mock.Mock
}

func (m *MockHelloHandler) MockHelloHandler(w http.ResponseWriter, r *http.Request) (interface{}) {
	args := m.Called(r)
	return args.Get(0)
}

func TestHelloHandler(t *testing.T) {
	t.Run("Successful HelloHandler Response", func(t *testing.T) {
		// Create a new HTTP request
		req := httptest.NewRequest(http.MethodGet, "/hello", nil)

		// Create a ResponseRecorder (to record the response)
		w := httptest.NewRecorder()

		// Call the handler function
		HelloHandler(w, req)

		// Read the response
		resp := w.Result()
		defer resp.Body.Close()

		// Assert status code
		assert.Equal(t, http.StatusOK, resp.StatusCode)

		// Decode the response body
		var response map[string]string
		json.NewDecoder(resp.Body).Decode(&response)

		// Assert the response body
		assert.Equal(t, "", response["Message"])
	})
}

func TestServeSwaggerDocs(t *testing.T) {
	t.Run("Successful Swagger Docs Serve", func(t *testing.T) {
		// Create a new HTTP request
		req := httptest.NewRequest(http.MethodGet, "/swagger.yaml", nil)

		// Create a ResponseRecorder (to record the response)
		w := httptest.NewRecorder()

		// Call the handler function
		ServeSwaggerDocs(w, req)

		// Read the response
		resp := w.Result()
		defer resp.Body.Close()

		// Assert status code
		assert.Equal(t, http.StatusNotFound, resp.StatusCode)

		body, err := io.ReadAll(resp.Body)
		assert.NoError(t, err)
		assert.NotEmpty(t, body)
	})
}