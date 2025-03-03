package services

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/models"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func MockHandleCreateTag(m *mock.Mock, w http.ResponseWriter, r *http.Request) (int, error) {
	return http.StatusOK, nil
}

func MockHandleDeleteTag(m *mock.Mock, w http.ResponseWriter, r *http.Request) (int, error) {
	return http.StatusOK, nil
}

func MockHandleSetTag(m *mock.Mock, w http.ResponseWriter, r *http.Request) (int, error) {
	return http.StatusOK, nil
}

func MockHandleRemoveTag(m *mock.Mock, w http.ResponseWriter, r *http.Request) (int, error) {
	return http.StatusOK, nil
}

func MockHandleGetTags(m *mock.Mock, w http.ResponseWriter, r *http.Request) ([]models.Tag, error, int) {
	return []models.Tag{}, nil, http.StatusOK
}

func TestHandleCreateTag(t *testing.T) {
	mockHandler := mock.Mock{}
	mockHandler.On("HandleCreateTag", mock.Anything).Return(http.StatusOK, nil)
	mock := new(mock.Mock)

	// Test case 1: Successful creation
	t.Run("Successful Creation", func(t *testing.T) {
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/register", nil)
		w := httptest.NewRecorder()
		mockHandler.On("HandleCreateTag", req).Return(http.StatusOK, nil)

		// Act
		MockHandleCreateTag(mock, w, req)

		// Assert
		assert.Equal(t, http.StatusOK, w.Code)
	})

	// Test case 2: Invalid request format
	t.Run("Invalid Request Format", func(t *testing.T) {
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/register", nil)
		w := httptest.NewRecorder()
		mockHandler.On("HandleCreateTag", req).Return(http.StatusBadRequest, nil)

		// Act
		MockHandleCreateTag(mock, w, req)

		// Assert
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func TestHandleDeleteTag(t *testing.T) {
	mockHandler := mock.Mock{}
	mockHandler.On("HandleDeleteTag", mock.Anything).Return(http.StatusOK, nil)
	mock := new(mock.Mock)

	// Test case 1: Successful deletion
	t.Run("Successful Deletion", func(t *testing.T) {
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/register", nil)
		w := httptest.NewRecorder()
		mockHandler.On("HandleDeleteTag", req).Return(http.StatusOK, nil)

		// Act
		MockHandleDeleteTag(mock, w, req)

		// Assert
		assert.Equal(t, http.StatusOK, w.Code)
	})
}

// Test HandleSetTag
func TestHandleSetTag(t *testing.T) {
	mockHandler := mock.Mock{}
	mockHandler.On("HandleSetTag", mock.Anything).Return(http.StatusOK, nil)
	mock := new(mock.Mock)

	// Test case 1: Successful setting
	t.Run("Successful Setting", func(t *testing.T) {
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/register", nil)
		w := httptest.NewRecorder()
		mockHandler.On("HandleSetTag", req).Return(http.StatusOK, nil)

		// Act
		MockHandleSetTag(mock, w, req)

		// Assert
		assert.Equal(t, http.StatusOK, w.Code)
	})
}

// Test HandleRemoveTag
func TestHandleRemoveTag(t *testing.T) {
	mockHandler := mock.Mock{}
	mockHandler.On("HandleRemoveTag", mock.Anything).Return(http.StatusOK, nil)
	mock := new(mock.Mock)

	// Test case 1: Successful removal
	t.Run("Successful Removal", func(t *testing.T) {
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/register", nil)
		w := httptest.NewRecorder()
		mockHandler.On("HandleRemoveTag", req).Return(http.StatusOK, nil)

		// Act
		MockHandleRemoveTag(mock, w, req)

		// Assert
		assert.Equal(t, http.StatusOK, w.Code)
	})
}

// Test HandleGetTags
func TestHandleGetTags(t *testing.T) {
	mockHandler := mock.Mock{}
	mockHandler.On("HandleGetTags", mock.Anything).Return([]models.Tag{}, nil, http.StatusOK)
	mock := new(mock.Mock)

	// Test case 1: Successful retrieval
	t.Run("Successful Retrieval", func(t *testing.T) {
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/register", nil)
		w := httptest.NewRecorder()
		mockHandler.On("HandleGetTags", req).Return([]models.Tag{}, nil, http.StatusOK)

		// Act
		MockHandleGetTags(mock, w, req)

		// Assert
		assert.Equal(t, http.StatusOK, w.Code)
	})
}
