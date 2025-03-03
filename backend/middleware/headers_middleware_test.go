package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

// TestJSONMiddleware tests the JSONMiddleware function
func TestJSONMiddleware(t *testing.T) {
	// Create a test request
	req, err := http.NewRequest("GET", "/", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Create a test response recorder
	w := httptest.NewRecorder()

	// Create a test handler that just writes "Hello, World!"
	h := http.Handler(http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		rw.Write([]byte("Hello, World!"))
	}))

	// Wrap the test handler with the JSONMiddleware function
	h = JSONMiddleware(h)

	// Call the test handler
	h.ServeHTTP(w, req)

	// Assert that the content type is application/json
	assert.Equal(t, "application/json", w.Header().Get("Content-Type"))

	// Assert that the response body is the expected JSON
	expectedResponse := "Hello, World!"
	assert.Equal(t, expectedResponse, w.Body.String())
}
