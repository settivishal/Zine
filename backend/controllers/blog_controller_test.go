package controllers

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockHandleGetBlog struct {
	mock.Mock
}

type MockHandleCreateBlog struct {
	mock.Mock
}

type MockHandleSaveBlog struct {
	mock.Mock
}

func (m *MockHandleGetBlog) MockHandleGetBlog(w http.ResponseWriter, r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

func (m *MockHandleCreateBlog) MockHandleCreateBlog(w http.ResponseWriter, r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

func (m *MockHandleSaveBlog) MockHandleSaveBlog(w http.ResponseWriter, r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

func TestGetBlog(t *testing.T) {
	// Test case 1: tag created successfully
	t.Run("Successful CreateTag Response", func(t *testing.T) {
		// Mock dependencies
		mockHandleGetBlog := new(MockHandleGetBlog)

		req := httptest.NewRequest(http.MethodPost, "/blog/{_id}", nil)

		mockHandleGetBlog.On("MockHandleGetBlog", req).Return("Tag created successfully", nil, http.StatusOK)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleGetBlog.MockHandleGetBlog(w, req)

		// Assertions
		assert.Equal(t, "Tag created successfully", response)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, statusCode)

		// Verify that the expected call was made
		mockHandleGetBlog.AssertExpectations(t)
	})

	// Test case 2: error creating tag
	t.Run("Error CreateTag Response", func(t *testing.T) {
		mockHandleGetBlog := new(MockHandleGetBlog)

		req := httptest.NewRequest(http.MethodPost, "/blog/{_id}", nil)

		mockHandleGetBlog.On("MockHandleGetBlog", req).Return(nil, errors.New("error creating tag"), http.StatusInternalServerError)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleGetBlog.MockHandleGetBlog(w, req)

		// Assertions
		assert.Nil(t, response)
		assert.Equal(t, "error creating tag", err.Error())
		assert.Equal(t, http.StatusInternalServerError, statusCode)

		// Verify that the expected call was made
		mockHandleGetBlog.AssertExpectations(t)
	})
}

func TestCreateBlog(t *testing.T) {
	// Test case 1: tag created successfully
	t.Run("Successful CreateTag Response", func(t *testing.T) {
		// Mock dependencies
		mockHandleCreateBlog := new(MockHandleCreateBlog)

		req := httptest.NewRequest(http.MethodPost, "/blog/create", nil)

		mockHandleCreateBlog.On("MockHandleCreateBlog", req).Return("Tag created successfully", nil, http.StatusOK)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleCreateBlog.MockHandleCreateBlog(w, req)

		// Assertions
		assert.Equal(t, "Tag created successfully", response)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, statusCode)

		// Verify that the expected call was made
		mockHandleCreateBlog.AssertExpectations(t)
	})

	// Test case 2: error creating tag
	t.Run("Error CreateTag Response", func(t *testing.T) {
		mockHandleCreateBlog := new(MockHandleCreateBlog)

		req := httptest.NewRequest(http.MethodPost, "/blog/create", nil)

		mockHandleCreateBlog.On("MockHandleCreateBlog", req).Return(nil, errors.New("error creating tag"), http.StatusInternalServerError)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleCreateBlog.MockHandleCreateBlog(w, req)

		// Assertions
		assert.Nil(t, response)
		assert.Equal(t, "error creating tag", err.Error())
		assert.Equal(t, http.StatusInternalServerError, statusCode)

		// Verify that the expected call was made
		mockHandleCreateBlog.AssertExpectations(t)
	})
}

func TestSaveBlog(t *testing.T) {
	// Test case 1: tag created successfully
	t.Run("Successful CreateTag Response", func(t *testing.T) {
		// Mock dependencies
		mockHandleSaveBlog := new(MockHandleSaveBlog)

		req := httptest.NewRequest(http.MethodPost, "/blog/save", nil)

		mockHandleSaveBlog.On("MockHandleSaveBlog", req).Return("Tag created successfully", nil, http.StatusOK)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleSaveBlog.MockHandleSaveBlog(w, req)

		// Assertions
		assert.Equal(t, "Tag created successfully", response)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, statusCode)

		// Verify that the expected call was made
		mockHandleSaveBlog.AssertExpectations(t)
	})

	// Test case 2: error creating tag
	t.Run("Error CreateTag Response", func(t *testing.T) {
		mockHandleSaveBlog := new(MockHandleSaveBlog)

		req := httptest.NewRequest(http.MethodPost, "/blog/save", nil)		

		mockHandleSaveBlog.On("MockHandleSaveBlog", req).Return(nil, errors.New("error creating tag"), http.StatusInternalServerError)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleSaveBlog.MockHandleSaveBlog(w, req)

		// Assertions
		assert.Nil(t, response)
		assert.Equal(t, "error creating tag", err.Error())		
		assert.Equal(t, http.StatusInternalServerError, statusCode)

		// Verify that the expected call was made		
		mockHandleSaveBlog.AssertExpectations(t)
	})
}