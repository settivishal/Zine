package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestJWTAuthMiddleware(t *testing.T) {
	// Create a test request
	req, err := http.NewRequest("GET", "/", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Create a test response recorder
	w := httptest.NewRecorder()

	// Call the JWTAuthMiddleware function
	JWTAuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello, World!"))
	})).ServeHTTP(w, req)

	// Assert that the response code is 401
	assert.Equal(t, http.StatusUnauthorized, w.Code)
}
