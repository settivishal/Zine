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

type MockHandleUploadCover struct {
	mock.Mock
}

type MockHandleGetBlogs struct {
	mock.Mock
}

type MockHandleGetBlogByDate struct {
	mock.Mock
}

type MockHandleGetBlogsByTagIDs struct {
	mock.Mock
}

type MockHandleDeleteCover struct {
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

func (m *MockHandleUploadCover) MockHandleUploadCover(w http.ResponseWriter, r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

func (m *MockHandleGetBlogs) MockHandleGetBlogs(w http.ResponseWriter, r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

func (m *MockHandleGetBlogByDate) MockHandleGetBlogByDate(w http.ResponseWriter, r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

func (m *MockHandleGetBlogsByTagIDs) MockHandleGetBlogsByTagIDs(w http.ResponseWriter, r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

func (m *MockHandleDeleteCover) MockHandleDeleteCover(w http.ResponseWriter, r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

func TestGetBlog(t *testing.T) {
	// Test case 1: get tag successfully
	t.Run("Successful getting Response", func(t *testing.T) {
		// Mock dependencies
		mockHandleGetBlog := new(MockHandleGetBlog)

		req := httptest.NewRequest(http.MethodPost, "/blog/{_id}", nil)

		mockHandleGetBlog.On("MockHandleGetBlog", req).Return("Blog fetched successfully", nil, http.StatusOK)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleGetBlog.MockHandleGetBlog(w, req)

		// Assertions
		assert.Equal(t, "Blog fetched successfully", response)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, statusCode)

		// Verify that the expected call was made
		mockHandleGetBlog.AssertExpectations(t)
	})

	// Test case 2: error getting tag
	t.Run("Error getting Response", func(t *testing.T) {
		mockHandleGetBlog := new(MockHandleGetBlog)

		req := httptest.NewRequest(http.MethodPost, "/blog/{_id}", nil)

		mockHandleGetBlog.On("MockHandleGetBlog", req).Return(nil, errors.New("Error getting blog"), http.StatusInternalServerError)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleGetBlog.MockHandleGetBlog(w, req)

		// Assertions
		assert.Nil(t, response)
		assert.Equal(t, "Error getting blog", err.Error())
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
	// Test case 1: tag saved successfully
	t.Run("Successful Saveing Tag Response", func(t *testing.T) {
		// Mock dependencies
		mockHandleSaveBlog := new(MockHandleSaveBlog)

		req := httptest.NewRequest(http.MethodPost, "/blog/save", nil)

		mockHandleSaveBlog.On("MockHandleSaveBlog", req).Return("Blog saved successfully", nil, http.StatusOK)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleSaveBlog.MockHandleSaveBlog(w, req)

		// Assertions
		assert.Equal(t, "Blog saved successfully", response)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, statusCode)

		// Verify that the expected call was made
		mockHandleSaveBlog.AssertExpectations(t)
	})

	// Test case 2: error saving tag
	t.Run("Error Saving Tag Response", func(t *testing.T) {
		mockHandleSaveBlog := new(MockHandleSaveBlog)

		req := httptest.NewRequest(http.MethodPost, "/blog/save", nil)

		mockHandleSaveBlog.On("MockHandleSaveBlog", req).Return(nil, errors.New("Error saving blog"), http.StatusInternalServerError)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleSaveBlog.MockHandleSaveBlog(w, req)

		// Assertions
		assert.Nil(t, response)
		assert.Equal(t, "Error saving blog", err.Error())
		assert.Equal(t, http.StatusInternalServerError, statusCode)

		// Verify that the expected call was made
		mockHandleSaveBlog.AssertExpectations(t)
	})
}

func TestUploadCover(t *testing.T) {
	// Test case 1: tag created successfully
	t.Run("Successful CreateTag Response", func(t *testing.T) {
		// Mock dependencies
		mockHandleUploadCover := new(MockHandleUploadCover)

		req := httptest.NewRequest(http.MethodPost, "/api/blog/cover", nil)

		mockHandleUploadCover.On("MockHandleUploadCover", req).Return("Image uploaded successfully", nil, http.StatusOK)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleUploadCover.MockHandleUploadCover(w, req)

		// Assertions
		assert.Equal(t, "Image uploaded successfully", response)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, statusCode)

		// Verify that the expected call was made
		mockHandleUploadCover.AssertExpectations(t)
	})

	// Test case 2: error creating tag
	t.Run("Error CreateTag Response", func(t *testing.T) {
		mockHandleUploadCover := new(MockHandleUploadCover)

		req := httptest.NewRequest(http.MethodPost, "/api/blog/cover", nil)

		mockHandleUploadCover.On("MockHandleUploadCover", req).Return(nil, errors.New("Error uploading cover"), http.StatusInternalServerError)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleUploadCover.MockHandleUploadCover(w, req)

		// Assertions
		assert.Nil(t, response)
		assert.Equal(t, "Error uploading cover", err.Error())
		assert.Equal(t, http.StatusInternalServerError, statusCode)

		// Verify that the expected call was made
		mockHandleUploadCover.AssertExpectations(t)
	})
}

func TestGetBlogs(t *testing.T) {
	// Test case 1: get blogs successfuly
	t.Run("Successful GetBlogs Response", func(t *testing.T) {
		// Mock dependencies
		mockHandleGetBlogs := new(MockHandleGetBlogs)

		req := httptest.NewRequest(http.MethodGet, "/api/blogs", nil)

		mockHandleGetBlogs.On("MockHandleGetBlogs", req).Return("Blogs fetched successfully", nil, http.StatusOK)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleGetBlogs.MockHandleGetBlogs(w, req)

		// Assertions
		assert.Equal(t, "Blogs fetched successfully", response)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, statusCode)

		// Verify that the expected call was made
		mockHandleGetBlogs.AssertExpectations(t)
	})

	// Test case 2: error getting blogs
	t.Run("Error GetBlogs Response", func(t *testing.T) {
		mockHandleGetBlogs := new(MockHandleGetBlogs)

		req := httptest.NewRequest(http.MethodGet, "/api/blogs", nil)

		mockHandleGetBlogs.On("MockHandleGetBlogs", req).Return(nil, errors.New("Error getting blogs"), http.StatusInternalServerError)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleGetBlogs.MockHandleGetBlogs(w, req)

		// Assertions
		assert.Nil(t, response)
		assert.Equal(t, "Error getting blogs", err.Error())
		assert.Equal(t, http.StatusInternalServerError, statusCode)

		// Verify that the expected call was made
		mockHandleGetBlogs.AssertExpectations(t)
	})
}

// TestGetBlogByDate tests the GetBlogByDate function
func TestGetBlogByDate(t *testing.T) {
	// Test case 1: get blogs successfuly by date
	t.Run("Successful GetBlogsByDate Response", func(t *testing.T) {
		// Mock dependencies
		mockHandleGetBlogByDate := new(MockHandleGetBlogByDate)

		req := httptest.NewRequest(http.MethodGet, "/api/blog/date/2025-03-24", nil)

		mockHandleGetBlogByDate.On("MockHandleGetBlogByDate", req).Return("Blog fetched successfully", nil, http.StatusOK)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleGetBlogByDate.MockHandleGetBlogByDate(w, req)

		// Assertions
		assert.Equal(t, "Blog fetched successfully", response)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, statusCode)

		// Verify that the expected call was made
		mockHandleGetBlogByDate.AssertExpectations(t)
	})

	// Test case 2: error getting blogs
	t.Run("Error GetBlogsByDate Response", func(t *testing.T) {
		mockHandleGetBlogByDate := new(MockHandleGetBlogByDate)

		req := httptest.NewRequest(http.MethodGet, "/api/blog/date/2025-03-24", nil)

		mockHandleGetBlogByDate.On("MockHandleGetBlogByDate", req).Return(nil, errors.New("Error getting blog"), http.StatusInternalServerError)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleGetBlogByDate.MockHandleGetBlogByDate(w, req)

		// Assertions
		assert.Nil(t, response)
		assert.Equal(t, "Error getting blog", err.Error())
		assert.Equal(t, http.StatusInternalServerError, statusCode)

		// Verify that the expected call was made
		mockHandleGetBlogByDate.AssertExpectations(t)
	})
}

// TestGetBlogsByTagIDs tests the GetBlogsByTagIDs function
func TestGetBlogsByTagIDs(t *testing.T) {
	// Test case 1: get blogs successfuly by tag ids
	t.Run("Successful GetBlogsByTagIDs Response", func(t *testing.T) {
		// Mock dependencies
		mockHandleGetBlogsByTagIDs := new(MockHandleGetBlogsByTagIDs)

		req := httptest.NewRequest(http.MethodGet, "/api/blogs/getByTagIDs", nil)

		mockHandleGetBlogsByTagIDs.On("MockHandleGetBlogsByTagIDs", req).Return("Blogs fetched successfully", nil, http.StatusOK)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleGetBlogsByTagIDs.MockHandleGetBlogsByTagIDs(w, req)

		// Assertions
		assert.Equal(t, "Blogs fetched successfully", response)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, statusCode)

		// Verify that the expected call was made
		mockHandleGetBlogsByTagIDs.AssertExpectations(t)
	})

	// Test case 2: error getting blogs
	t.Run("Error GetBlogsByTagIDs Response", func(t *testing.T) {
		mockHandleGetBlogsByTagIDs := new(MockHandleGetBlogsByTagIDs)

		req := httptest.NewRequest(http.MethodGet, "/api/blogs/getByTagIDs", nil)

		mockHandleGetBlogsByTagIDs.On("MockHandleGetBlogsByTagIDs", req).Return(nil, errors.New("Error getting blogs"), http.StatusInternalServerError)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleGetBlogsByTagIDs.MockHandleGetBlogsByTagIDs(w, req)

		// Assertions
		assert.Nil(t, response)
		assert.Equal(t, "Error getting blogs", err.Error())
		assert.Equal(t, http.StatusInternalServerError, statusCode)

		// Verify that the expected call was made
		mockHandleGetBlogsByTagIDs.AssertExpectations(t)
	})
}

// TestDeleteCover tests the DeleteCover function
func TestDeleteCover(t *testing.T) {
	// Test case 1: delete cover successfully
	t.Run("Successful DeleteCover Response", func(t *testing.T) {
		// Mock dependencies
		mockHandleDeleteCover := new(MockHandleDeleteCover)

		req := httptest.NewRequest(http.MethodDelete, "/api/blog/cover/delete", nil)

		mockHandleDeleteCover.On("MockHandleDeleteCover", req).Return("Image deleted successfully", nil, http.StatusOK)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleDeleteCover.MockHandleDeleteCover(w, req)

		// Assertions
		assert.Equal(t, "Image deleted successfully", response)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, statusCode)

		// Verify that the expected call was made
		mockHandleDeleteCover.AssertExpectations(t)
	})

	// Test case 2: error deleting cover
	t.Run("Error DeleteCover Response", func(t *testing.T) {
		mockHandleDeleteCover := new(MockHandleDeleteCover)

		req := httptest.NewRequest(http.MethodDelete, "/api/blog/cover/delete", nil)

		mockHandleDeleteCover.On("MockHandleDeleteCover", req).Return(nil, errors.New("Error deleting cover"), http.StatusInternalServerError)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockHandleDeleteCover.MockHandleDeleteCover(w, req)

		// Assertions
		assert.Nil(t, response)
		assert.Equal(t, "Error deleting cover", err.Error())
		assert.Equal(t, http.StatusInternalServerError, statusCode)

		// Verify that the expected call was made
		mockHandleDeleteCover.AssertExpectations(t)
	})
}
