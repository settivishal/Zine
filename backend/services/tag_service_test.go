package services

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/models"
)

// TestHandleGetTags is a unitest for HandleGetTags
func TestHandleGetTags(t *testing.T) {
	// Create a mock database with a single tag
	mockTags := []models.Tag{
		{
			UserID: "test@example.com",
			Text:   "Test Tag",
		},
	}

	// Set up the test request
	req, err := http.NewRequest("GET", "/api/tags", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Set up the test context with the mock database
	ctx := context.WithValue(req.Context(), "tags", mockTags)

	// Create a ResponseRecorder to record the response
	rr := httptest.NewRecorder()

	// Call the function being tested
	tags, err, status := HandleGetTags(rr, req.WithContext(ctx))

	// Check the response
	if err != nil {
		t.Error(err)
	}

	if status != http.StatusOK {
		t.Errorf("expected status %d, got %d", http.StatusOK, status)
	}

	// Check that the tags were returned correctly
	if len(tags) != 1 {
		t.Errorf("expected 1 tag, got %d", len(tags))
	}

	if tags[0].UserID != "test@example.com" {
		t.Errorf("expected userID %s, got %s", "test@example.com", tags[0].UserID)
	}

	if tags[0].Text != "Test Tag" {
		t.Errorf("expected text %s, got %s", "Test Tag", tags[0].Text)
	}
	t.Log("Success, HandleGetTags unit test passed")
	t.Log("Testing for error handling")
}
