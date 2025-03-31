package services

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/models"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockHandleCreateTag struct {
	mock.Mock
}

func (m *MockHandleCreateTag) MockHandleCreateTag(w http.ResponseWriter, r *http.Request) (int, error) {
	args := m.Called(r)
	return args.Int(0), args.Error(1)
}

type MockHandleDeleteTag struct {
	mock.Mock
}

func (m *MockHandleDeleteTag) MockHandleDeleteTag(w http.ResponseWriter, r *http.Request) (int, error) {
	args := m.Called(r)
	return args.Int(0), args.Error(1)
}

type MockHandleSetTag struct {
	mock.Mock
}

func (m *MockHandleSetTag) MockHandleSetTag(w http.ResponseWriter, r *http.Request) (int, error) {
	args := m.Called(r)
	return args.Int(0), args.Error(1)
}

type MockHandleRemoveTag struct {
	mock.Mock
}

func (m *MockHandleRemoveTag) MockHandleRemoveTag(w http.ResponseWriter, r *http.Request) (int, error) {
	args := m.Called(r)
	return args.Int(0), args.Error(1)
}

type MockHandleGetTags struct {
	mock.Mock
}

func (m *MockHandleGetTags) MockHandleGetTags(w http.ResponseWriter, r *http.Request) ([]models.Tag, error, int) {
	args := m.Called(r)
	return args.Get(0).([]models.Tag), args.Error(1), args.Int(2)
}

type MockHandleGetTagsByIDs struct {
	mock.Mock
}

func (m *MockHandleGetTagsByIDs) MockHandleGetTagsByIDs(w http.ResponseWriter, r *http.Request) ([]models.Tag, error, int) {
	args := m.Called(r)
	return args.Get(0).([]models.Tag), args.Error(1), args.Int(2)
}

func TestHandleCreateTag(t *testing.T) {
	// Test case 1: Successful creation
	t.Run("Successful Creation", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleCreateTag)

		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/tag/create", nil)
		w := httptest.NewRecorder()
		mockSuccessHandler.On("MockHandleCreateTag", req).Return(http.StatusOK, nil)

		// Act
		response, err := mockSuccessHandler.MockHandleCreateTag(w, req)

		// Assert
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, response)

		mockSuccessHandler.AssertExpectations(t)
	})

	// Test case 2: Invalid request format
	t.Run("Invalid Request Format", func(t *testing.T) {
		mockFailureHandler := new(MockHandleCreateTag)
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/tag/create", nil)
		w := httptest.NewRecorder()
		mockFailureHandler.On("MockHandleCreateTag", req).Return(http.StatusBadRequest, errors.New("Invalid request format"))

		// Act
		response, err := mockFailureHandler.MockHandleCreateTag(w, req)

		// Assert
		assert.EqualError(t, err, "Invalid request format")
		assert.Equal(t, http.StatusBadRequest, response)

		mockFailureHandler.AssertExpectations(t)
	})
}

func TestHandleDeleteTag(t *testing.T) {
	// Test case 1: Successful deletion
	t.Run("Successful Deletion", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleDeleteTag)
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/tag/delete", nil)
		w := httptest.NewRecorder()
		mockSuccessHandler.On("MockHandleDeleteTag", req).Return(http.StatusOK, nil)

		// Act
		response, err := mockSuccessHandler.MockHandleDeleteTag(w, req)

		// Assert
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, response)

		mockSuccessHandler.AssertExpectations(t)

		// Assert
		assert.Equal(t, http.StatusOK, w.Code)
	})

	// Test case 2: Invalid request format
	t.Run("Invalid Request Format", func(t *testing.T) {
		mockFailureHandler := new(MockHandleDeleteTag)
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/tag/delete", nil)
		w := httptest.NewRecorder()
		mockFailureHandler.On("MockHandleDeleteTag", req).Return(http.StatusBadRequest, errors.New("Invalid request format"))

		// Act
		response, err := mockFailureHandler.MockHandleDeleteTag(w, req)

		// Assert
		assert.EqualError(t, err, "Invalid request format")
		assert.Equal(t, http.StatusBadRequest, response)

		mockFailureHandler.AssertExpectations(t)
	})

	// Test case 3: Tag not found
	t.Run("Tag Not Found", func(t *testing.T) {
		mockFailureHandler := new(MockHandleDeleteTag)
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/tag/delete", nil)
		w := httptest.NewRecorder()
		mockFailureHandler.On("MockHandleDeleteTag", req).Return(http.StatusNotFound, errors.New("Tag not found"))

		// Act
		response, err := mockFailureHandler.MockHandleDeleteTag(w, req)

		// Assert
		assert.EqualError(t, err, "Tag not found")
		assert.Equal(t, http.StatusNotFound, response)

		mockFailureHandler.AssertExpectations(t)
	})
}

// Test HandleSetTag
func TestHandleSetTag(t *testing.T) {
	// Test case 1: Successful setting
	t.Run("Successful Setting", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleSetTag)
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/tag/set", nil)
		w := httptest.NewRecorder()
		mockSuccessHandler.On("MockHandleSetTag", req).Return(http.StatusOK, nil)

		// Act
		response, err := mockSuccessHandler.MockHandleSetTag(w, req)

		// Assert
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, response)

		mockSuccessHandler.AssertExpectations(t)
	})

	// Test case 2: Invalid request format
	t.Run("Invalid Request Format", func(t *testing.T) {
		mockFailureHandler := new(MockHandleSetTag)
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/tag/set", nil)
		w := httptest.NewRecorder()
		mockFailureHandler.On("MockHandleSetTag", req).Return(http.StatusBadRequest, errors.New("Invalid request format"))

		// Act
		response, err := mockFailureHandler.MockHandleSetTag(w, req)

		// Assert
		assert.EqualError(t, err, "Invalid request format")
		assert.Equal(t, http.StatusBadRequest, response)

		mockFailureHandler.AssertExpectations(t)
	})

	// Test case 3: Tag not found
	t.Run("Tag Not Found", func(t *testing.T) {
		mockFailureHandler := new(MockHandleSetTag)
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/tag/set", nil)
		w := httptest.NewRecorder()
		mockFailureHandler.On("MockHandleSetTag", req).Return(http.StatusNotFound, errors.New("Tag not found"))

		// Act
		response, err := mockFailureHandler.MockHandleSetTag(w, req)

		// Assert
		assert.EqualError(t, err, "Tag not found")
		assert.Equal(t, http.StatusNotFound, response)

		mockFailureHandler.AssertExpectations(t)
	})
}

// Test HandleRemoveTag
func TestHandleRemoveTag(t *testing.T) {
	// Test case 1: Successful removal
	t.Run("Successful Removal", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleRemoveTag)
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/tag/remove", nil)
		w := httptest.NewRecorder()
		mockSuccessHandler.On("MockHandleRemoveTag", req).Return(http.StatusOK, nil)

		// Act
		response, err := mockSuccessHandler.MockHandleRemoveTag(w, req)

		// Assert
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, response)

		mockSuccessHandler.AssertExpectations(t)

		// Assert
		assert.Equal(t, http.StatusOK, w.Code)
		mockSuccessHandler.AssertExpectations(t)
	})

	// Test case 2: Invalid request format
	t.Run("Invalid Request Format", func(t *testing.T) {
		mockFailureHandler := new(MockHandleRemoveTag)
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/tag/remove", nil)
		w := httptest.NewRecorder()
		mockFailureHandler.On("MockHandleRemoveTag", req).Return(http.StatusBadRequest, errors.New("Invalid request format"))

		// Act
		response, err := mockFailureHandler.MockHandleRemoveTag(w, req)

		// Assert
		assert.EqualError(t, err, "Invalid request format")
		assert.Equal(t, http.StatusBadRequest, response)

		mockFailureHandler.AssertExpectations(t)
	})

	// Test case 3: Tag not found
	t.Run("Tag Not Found", func(t *testing.T) {
		mockFailureHandler := new(MockHandleRemoveTag)
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/tag/remove", nil)
		w := httptest.NewRecorder()
		mockFailureHandler.On("MockHandleRemoveTag", req).Return(http.StatusNotFound, errors.New("Tag not found"))

		// Act
		response, err := mockFailureHandler.MockHandleRemoveTag(w, req)

		// Assert
		assert.EqualError(t, err, "Tag not found")
		assert.Equal(t, http.StatusNotFound, response)

		mockFailureHandler.AssertExpectations(t)
	})

}

// Test HandleGetTags
func TestHandleGetTags(t *testing.T) {
	// Test case 1: Successful retrieval
	t.Run("Successful Retrieval", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleGetTags)
		// Arrange
		req := httptest.NewRequest(http.MethodGet, "/tags", nil)
		w := httptest.NewRecorder()

		mockSuccessHandler.On("MockHandleGetTags", req).Return([]models.Tag{
			{ID: "1",
				UserID: "1",
				Text:   "tag1",
				Color:  "#FFF000",
				Dates:  []string{"2021-01-01"}},
			{ID: "2",
				UserID: "1",
				Text:   "tag2",
				Color:  "#DDDAAA",
				Dates:  []string{"2021-01-02"}},
		}, nil, http.StatusOK)

		// Act
		tags, err, response := mockSuccessHandler.MockHandleGetTags(w, req)

		// Assert
		assert.Nil(t, err)
		assert.Equal(t, http.StatusOK, response)
		assert.Equal(t, 2, len(tags))
		mockSuccessHandler.AssertExpectations(t)
	})

	// Test case 2: Invalid request format
	t.Run("Invalid Request Format", func(t *testing.T) {
		mockFailureHandler := new(MockHandleGetTags)
		// Arrange
		req := httptest.NewRequest(http.MethodGet, "/tags", nil)
		w := httptest.NewRecorder()
		mockFailureHandler.On("MockHandleGetTags", req).Return([]models.Tag{}, errors.New("Invalid request format"), http.StatusBadRequest)

		// Act
		tags, err, response := mockFailureHandler.MockHandleGetTags(w, req)

		// Assert
		assert.Equal(t, 0, len(tags))
		assert.EqualError(t, err, "Invalid request format")
		assert.Equal(t, http.StatusBadRequest, response)

		mockFailureHandler.AssertExpectations(t)
	})

	// Test case 3: Error retrieving tags
	t.Run("Error Retrieving Tags", func(t *testing.T) {
		mockFailureHandler := new(MockHandleGetTags)
		// Arrange
		req := httptest.NewRequest(http.MethodGet, "/tags", nil)
		w := httptest.NewRecorder()
		mockFailureHandler.On("MockHandleGetTags", req).Return([]models.Tag{}, errors.New("Error retrieving tags"), http.StatusInternalServerError)

		// Act
		_, err, response := mockFailureHandler.MockHandleGetTags(w, req)

		// Assert
		assert.EqualError(t, err, "Error retrieving tags")
		assert.Equal(t, http.StatusInternalServerError, response)

		mockFailureHandler.AssertExpectations(t)
	})
}
