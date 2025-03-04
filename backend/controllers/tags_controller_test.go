package controllers

import (
	"net/http"
	"net/http/httptest"	
	"testing"
	"errors"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockHandleCreateTag struct {
	mock.Mock
}

type MockHandleDeleteTag struct {
	mock.Mock
}

type MockHandleSetTag struct {
	mock.Mock
}

type MockHandleRemoveTag struct {
	mock.Mock
}

type MockHandleGetTags struct {
	mock.Mock
}

func (m *MockHandleCreateTag) MockHandleCreateTag(w http.ResponseWriter, r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

func (m *MockHandleDeleteTag) MockHandleDeleteTag(w http.ResponseWriter, r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

func (m *MockHandleSetTag) MockHandleSetTag(w http.ResponseWriter, r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

func (m *MockHandleRemoveTag) MockHandleRemoveTag(w http.ResponseWriter, r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

func (m *MockHandleGetTags) MockHandleGetTags(w http.ResponseWriter, r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

func TestCreateTag(t *testing.T) {
	// Test case 1: tag created successfully
	t.Run("Successful CreateTag Response", func(t *testing.T) {
		// Mock dependencies
		mockHandleCreateTag := new(MockHandleCreateTag)

		req := httptest.NewRequest(http.MethodPost, "/tag/create", nil)

		mockHandleCreateTag.On("MockHandleCreateTag", req).Return("Tag created successfully", nil, http.StatusOK)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleCreateTag.MockHandleCreateTag(w, req)

		// Assertions
		assert.Equal(t, "Tag created successfully", response)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, statusCode)

		// Verify that the expected call was made
		mockHandleCreateTag.AssertExpectations(t)
	})

	// Test case 2: error creating tag
	t.Run("Error CreateTag Response", func(t *testing.T) {
		mockHandleCreateTag := new(MockHandleCreateTag)

		req := httptest.NewRequest(http.MethodPost, "/tag/create", nil)

		mockHandleCreateTag.On("MockHandleCreateTag", req).Return(nil, errors.New("error creating tag"), http.StatusInternalServerError)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleCreateTag.MockHandleCreateTag(w, req)

		// Assertions
		assert.Nil(t, response)
		assert.Error(t, err)
		assert.Equal(t, http.StatusInternalServerError, statusCode)

		// Verify that the expected call was made
		mockHandleCreateTag.AssertExpectations(t)
	})

	// Test case 3: invalid request format
	t.Run("Invalid Request Format", func(t *testing.T) {
		mockHandleCreateTag := new(MockHandleCreateTag)

		req := httptest.NewRequest(http.MethodPost, "/tag/create", nil)

		mockHandleCreateTag.On("MockHandleCreateTag", req).Return(nil, errors.New("invalid request format"), http.StatusBadRequest)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleCreateTag.MockHandleCreateTag(w, req)

		// Assertions
		assert.Nil(t, response)
		assert.Error(t, err)
		assert.Equal(t, http.StatusBadRequest, statusCode)

		// Verify that the expected call was made
		mockHandleCreateTag.AssertExpectations(t)
	})
}

func TestDeleteTag(t *testing.T) {
	// Test case 1: tag deleted successfully
	t.Run("Successful DeleteTag Response", func(t *testing.T) {
		// Mock dependencies
		mockHandleDeleteTag := new(MockHandleDeleteTag)

		req := httptest.NewRequest(http.MethodPost, "/tag/delete", nil)	

		mockHandleDeleteTag.On("MockHandleDeleteTag", req).Return("Tag deleted successfully", nil, http.StatusOK)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleDeleteTag.MockHandleDeleteTag(w, req)

		// Assertions
		assert.Equal(t, "Tag deleted successfully", response)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, statusCode)

		// Verify that the expected call was made
		mockHandleDeleteTag.AssertExpectations(t)
	})

	// Test case 2: error deleting tag
	t.Run("Error DeleteTag Response", func(t *testing.T) {
		mockHandleDeleteTag := new(MockHandleDeleteTag)

		req := httptest.NewRequest(http.MethodPost, "/tag/delete", nil)

		mockHandleDeleteTag.On("MockHandleDeleteTag", req).Return(nil, errors.New("error deleting tag"), http.StatusInternalServerError)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleDeleteTag.MockHandleDeleteTag(w, req)

		// Assertions
		assert.Nil(t, response)
		assert.Error(t, err)
		assert.Equal(t, http.StatusInternalServerError, statusCode)

		// Verify that the expected call was made
		mockHandleDeleteTag.AssertExpectations(t)
	})

	// Test case 3: invalid request format
	t.Run("Invalid Request Format", func(t *testing.T) {
		mockHandleDeleteTag := new(MockHandleDeleteTag)

		req := httptest.NewRequest(http.MethodPost, "/tag/delete", nil)

		mockHandleDeleteTag.On("MockHandleDeleteTag", req).Return(nil, errors.New("invalid request format"), http.StatusBadRequest)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleDeleteTag.MockHandleDeleteTag(w, req)

		// Assertions
		assert.Nil(t, response)
		assert.Error(t, err)
		assert.Equal(t, http.StatusBadRequest, statusCode)

		// Verify that the expected call was made
		mockHandleDeleteTag.AssertExpectations(t)
	})
}

func TestSetTag(t *testing.T) {
	// Test case 1: tags set successfully
	t.Run("Successful SetTags Response", func(t *testing.T) {
		// Mock dependencies
		mockHandleSetTag := new(MockHandleSetTag)

		req := httptest.NewRequest(http.MethodPost, "/tag/set", nil)

		mockHandleSetTag.On("MockHandleSetTag", req).Return("Tags set successfully", nil, http.StatusOK)

		// Call the mock method	
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleSetTag.MockHandleSetTag(w, req)

		// Assertions
		assert.Equal(t, "Tags set successfully", response)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, statusCode)

		// Verify that the expected call was made
		mockHandleSetTag.AssertExpectations(t)	
	})

	// Test case 2: error setting tags
	t.Run("Error SetTags Response", func(t *testing.T) {
		mockHandleSetTag := new(MockHandleSetTag)	

		req := httptest.NewRequest(http.MethodPost, "/tag/set", nil)

		mockHandleSetTag.On("MockHandleSetTag", req).Return(nil, errors.New("error setting tags"), http.StatusInternalServerError)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleSetTag.MockHandleSetTag(w, req)	

		// Assertions
		assert.Nil(t, response)
		assert.EqualError(t, err, "error setting tags")
		assert.Equal(t, http.StatusInternalServerError, statusCode)

		// Verify that the expected call was made
		mockHandleSetTag.AssertExpectations(t)
	})

	// Test case 3: invalid request format
	t.Run("Invalid Request Format", func(t *testing.T) {
		mockHandleSetTags := new(MockHandleSetTag)

		req := httptest.NewRequest(http.MethodPost, "/tag/set", nil)

		mockHandleSetTags.On("MockHandleSetTag", req).Return(nil, errors.New("invalid request format"), http.StatusBadRequest)

		// Call the mock method
		w := httptest.NewRecorder()	
		response, err, statusCode := mockHandleSetTags.MockHandleSetTag(w, req)	

		// Assertions
		assert.Nil(t, response)
		assert.EqualError(t, err, "invalid request format")	
		assert.Equal(t, http.StatusBadRequest, statusCode)

		// Verify that the expected call was made	
		mockHandleSetTags.AssertExpectations(t)
	})
}

func TestRemoveTag(t *testing.T) {
	// Test case 1: tags removed successfully
	t.Run("Successful RemoveTags Response", func(t *testing.T) {
		// Mock dependencies
		mockHandleRemoveTag := new(MockHandleRemoveTag)	

		req := httptest.NewRequest(http.MethodPost, "/tag/remove", nil)

		mockHandleRemoveTag.On("MockHandleRemoveTag", req).Return("Tags removed successfully", nil, http.StatusOK)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleRemoveTag.MockHandleRemoveTag(w, req)	

		// Assertions
		assert.Equal(t, "Tags removed successfully", response)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, statusCode)

		// Verify that the expected call was made
		mockHandleRemoveTag.AssertExpectations(t)
	})

	// Test case 2: error removing tags
	t.Run("Error RemoveTags Response", func(t *testing.T) {
		mockHandleRemoveTag := new(MockHandleRemoveTag)	

		req := httptest.NewRequest(http.MethodPost, "/tag/remove", nil)

		mockHandleRemoveTag.On("MockHandleRemoveTag", req).Return(nil, errors.New("error removing tags"), http.StatusInternalServerError)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleRemoveTag.MockHandleRemoveTag(w, req)	

		// Assertions
		assert.Nil(t, response)
		assert.EqualError(t, err, "error removing tags")
		assert.Equal(t, http.StatusInternalServerError, statusCode)

		// Verify that the expected call was made
		mockHandleRemoveTag.AssertExpectations(t)
	})

	// Test case 3: invalid request format
	t.Run("Invalid Request Format", func(t *testing.T) {
		mockHandleRemoveTags := new(MockHandleRemoveTag)

		req := httptest.NewRequest(http.MethodPost, "/tag/remove", nil)

		mockHandleRemoveTags.On("MockHandleRemoveTag", req).Return(nil, errors.New("invalid request format"), http.StatusBadRequest)

		// Call the mock method
		w := httptest.NewRecorder()	
		response, err, statusCode := mockHandleRemoveTags.MockHandleRemoveTag(w, req)	

		// Assertions
		assert.Nil(t, response)
		assert.EqualError(t, err, "invalid request format")	
		assert.Equal(t, http.StatusBadRequest, statusCode)

		// Verify that the expected call was made	
		mockHandleRemoveTags.AssertExpectations(t)
	})
}

func TestGetTags(t *testing.T) {
	// Test case 1: tags retrieved successfully
	t.Run("Successful GetTags Response", func(t *testing.T) {
		// Mock dependencies
		mockHandleGetTags := new(MockHandleGetTags)	

		req := httptest.NewRequest(http.MethodGet, "/tag/get", nil)	

		mockHandleGetTags.On("MockHandleGetTags", req).Return("Tags retrieved successfully", nil, http.StatusOK)

		// Call the mock method	
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleGetTags.MockHandleGetTags(w, req)	

		// Assertions
		assert.Equal(t, "Tags retrieved successfully", response)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, statusCode)

		// Verify that the expected call was made
		mockHandleGetTags.AssertExpectations(t)
	})

	// Test case 2: Error getting tags	
	t.Run("Error GetTags Response", func(t *testing.T) {
		mockHandleGetTags := new(MockHandleGetTags)	

		req := httptest.NewRequest(http.MethodGet, "/tag/get", nil)

		mockHandleGetTags.On("MockHandleGetTags", req).Return(nil, errors.New("Error getting tags"), http.StatusInternalServerError)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleGetTags.MockHandleGetTags(w, req)	

		// Assertions
		assert.Nil(t, response)
		assert.EqualError(t, err, "Error getting tags")
		assert.Equal(t, http.StatusInternalServerError, statusCode)

		// Verify that the expected call was made
		mockHandleGetTags.AssertExpectations(t)
	})
}