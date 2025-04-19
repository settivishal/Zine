package services

import (
	"backend/models"
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

func (m *MockHandleGetBlog) MockHandleGetBlog(w http.ResponseWriter, r *http.Request) (int, error, *models.Blog) {
	args := m.Called(r)
	return args.Int(0), args.Error(1), args.Get(2).(*models.Blog)
}

type MockHandleCreateBlog struct {
	mock.Mock
}

func (m *MockHandleCreateBlog) MockHandleCreateBlog(w http.ResponseWriter, r *http.Request) (int, error, string) {
	args := m.Called(r)
	return args.Int(0), args.Error(1), args.String(2)
}

type MockHandleSaveBlog struct {
	mock.Mock
}

func (m *MockHandleSaveBlog) MockHandleSaveBlog(w http.ResponseWriter, r *http.Request) (int, error) {
	args := m.Called(r)
	return args.Int(0), args.Error(1)
}

type MockHandleUploadCover struct {
	mock.Mock
}

func (m *MockHandleUploadCover) MockHandleUploadCover(w http.ResponseWriter, r *http.Request) (int, error) {
	args := m.Called(r)
	return args.Int(0), args.Error(1)
}

type MockHandleGetBlogs struct {
	mock.Mock
}

func (m *MockHandleGetBlogs) MockHandleGetBlogs(w http.ResponseWriter, r *http.Request) (int, error, []models.Blog) {
	args := m.Called(r)
	return args.Int(0), args.Error(1), args.Get(2).([]models.Blog)
}

type MockHandleGetBlogByDate struct {
	mock.Mock
}

func (m *MockHandleGetBlogByDate) MockHandleGetBlogByDate(w http.ResponseWriter, r *http.Request) (int, error, []models.Blog) {
	args := m.Called(r)
	return args.Int(0), args.Error(1), args.Get(2).([]models.Blog)
}

type MockHandleGetBlogByTagIDs struct {
	mock.Mock
}

func (m *MockHandleGetBlogByTagIDs) MockHandleGetBlogByTagIDs(w http.ResponseWriter, r *http.Request) (int, error, []models.Blog) {
	args := m.Called(r)
	return args.Int(0), args.Error(1), args.Get(2).([]models.Blog)
}

func TestHandleGetBlog(t *testing.T) {
	// Successful case
	t.Run("successful case", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleGetBlog)
		// Arrange
		req := httptest.NewRequest(http.MethodGet, "/blog/get", nil)
		w := httptest.NewRecorder()
		mockSuccessHandler.On("MockHandleGetBlog", req).Return(http.StatusOK, nil, &models.Blog{})

		// Act
		response, err, blog := mockSuccessHandler.MockHandleGetBlog(w, req)

		// Assert
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, response)
		assert.NotNil(t, blog)
		mockSuccessHandler.AssertExpectations(t)
	})

	// Error case
	t.Run("error case", func(t *testing.T) {
		mockFailureHandler := new(MockHandleGetBlog)
		// Arrange
		req := httptest.NewRequest(http.MethodGet, "/blog/get", nil)
		w := httptest.NewRecorder()
		mockFailureHandler.On("MockHandleGetBlog", req).Return(http.StatusInternalServerError, errors.New("error"), &models.Blog{})

		// Act
		response, err, _ := mockFailureHandler.MockHandleGetBlog(w, req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusInternalServerError, response)
		mockFailureHandler.AssertExpectations(t)
	})
}

func TestHandleCreateBlog(t *testing.T) {
	// Successful case
	t.Run("successful case", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleCreateBlog)
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/blog/create", nil)
		w := httptest.NewRecorder()
		mockSuccessHandler.On("MockHandleCreateBlog", req).Return(http.StatusOK, nil, "success")

		// Act
		response, err, message := mockSuccessHandler.MockHandleCreateBlog(w, req)

		// Assert
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, response)
		assert.Equal(t, "success", message)
		mockSuccessHandler.AssertExpectations(t)
	})

	// Error case
	t.Run("error case", func(t *testing.T) {
		mockFailureHandler := new(MockHandleCreateBlog)
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/blog/create", nil)
		w := httptest.NewRecorder()
		mockFailureHandler.On("MockHandleCreateBlog", req).Return(http.StatusInternalServerError, errors.New("error"), "")

		// Act
		response, err, message := mockFailureHandler.MockHandleCreateBlog(w, req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusInternalServerError, response)
		assert.Equal(t, "", message)
		mockFailureHandler.AssertExpectations(t)
	})
}

func TestHandleSaveBlog(t *testing.T) {
	// Successful case
	t.Run("successful case", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleSaveBlog)
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/blog/save", nil)
		w := httptest.NewRecorder()
		mockSuccessHandler.On("MockHandleSaveBlog", req).Return(http.StatusOK, nil)

		// Act
		response, err := mockSuccessHandler.MockHandleSaveBlog(w, req)

		// Assert
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, response)
		mockSuccessHandler.AssertExpectations(t)
	})

	// Error case
	t.Run("error case", func(t *testing.T) {
		mockFailureHandler := new(MockHandleSaveBlog)
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/blog/save", nil)
		w := httptest.NewRecorder()
		mockFailureHandler.On("MockHandleSaveBlog", req).Return(http.StatusInternalServerError, errors.New("error"))

		// Act
		response, err := mockFailureHandler.MockHandleSaveBlog(w, req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusInternalServerError, response)
		mockFailureHandler.AssertExpectations(t)
	})
}

func TestHandleUploadCover(t *testing.T) {
	// Successful case
	t.Run("successful case", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleUploadCover)
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/blog/cover", nil)
		w := httptest.NewRecorder()
		mockSuccessHandler.On("MockHandleUploadCover", req).Return(http.StatusOK, nil)

		// Act
		response, err := mockSuccessHandler.MockHandleUploadCover(w, req)

		// Assert
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, response)
		mockSuccessHandler.AssertExpectations(t)
	})

	// Error case
	t.Run("error case", func(t *testing.T) {
		mockFailureHandler := new(MockHandleUploadCover)
		// Arrange
		req := httptest.NewRequest(http.MethodPost, "/blog/cover", nil)
		w := httptest.NewRecorder()
		mockFailureHandler.On("MockHandleUploadCover", req).Return(http.StatusInternalServerError, errors.New("error"))

		// Act
		response, err := mockFailureHandler.MockHandleUploadCover(w, req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusInternalServerError, response)
		mockFailureHandler.AssertExpectations(t)
	})
}

func TestHandleGetBlogs(t *testing.T) {
	// Successful case
	t.Run("successful case", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleGetBlogs)
		// Arrange
		req := httptest.NewRequest(http.MethodGet, "/blog/get", nil)
		w := httptest.NewRecorder()
		mockSuccessHandler.On("MockHandleGetBlogs", req).Return(http.StatusOK, nil, []models.Blog{})

		// Act
		response, err, blogs := mockSuccessHandler.MockHandleGetBlogs(w, req)

		// Assert
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, response)
		assert.NotNil(t, blogs)
		mockSuccessHandler.AssertExpectations(t)
	})

	// Error case
	t.Run("error case", func(t *testing.T) {
		mockFailureHandler := new(MockHandleGetBlogs)
		// Arrange
		req := httptest.NewRequest(http.MethodGet, "/blog/get", nil)
		w := httptest.NewRecorder()
		mockFailureHandler.On("MockHandleGetBlogs", req).Return(http.StatusInternalServerError, errors.New("error"), []models.Blog{})
		// Act
		response, err, _ := mockFailureHandler.MockHandleGetBlogs(w, req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusInternalServerError, response)
		mockFailureHandler.AssertExpectations(t)
	})
}

// TestHandleGetBlogsByDate tests the HandleGetBlogsByDate function
func TestHandleGetBlogsByDate(t *testing.T) {
	// Successful case
	t.Run("successful case", func(t *testing.T) {
		mockHandleGetBlogByDate := new(MockHandleGetBlogByDate)
		// Arrange
		req := httptest.NewRequest(http.MethodGet, "/api/blog/date/2025-03-24", nil)
		w := httptest.NewRecorder()
		mockHandleGetBlogByDate.On("MockHandleGetBlogByDate", req).Return(http.StatusOK, nil, []models.Blog{})

		// Act
		response, err, blogs := mockHandleGetBlogByDate.MockHandleGetBlogByDate(w, req)

		// Assert
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, response)
		assert.NotNil(t, blogs)
		mockHandleGetBlogByDate.AssertExpectations(t)
	})

	// Error case
	t.Run("error case", func(t *testing.T) {
		mockHandleGetBlogByDate := new(MockHandleGetBlogByDate)
		// Arrange
		req := httptest.NewRequest(http.MethodGet, "/api/blog/date/2025-03-24", nil)
		w := httptest.NewRecorder()
		mockHandleGetBlogByDate.On("MockHandleGetBlogByDate", req).Return(http.StatusInternalServerError, errors.New("error"), []models.Blog{})
		// Act
		response, err, _ := mockHandleGetBlogByDate.MockHandleGetBlogByDate(w, req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusInternalServerError, response)
		mockHandleGetBlogByDate.AssertExpectations(t)
	})
}

// TestHandleGetBlogsByTagIDs tests the HandleGetBlogsByTagIDs function
func TestHandleGetBlogsByTagIDs(t *testing.T) {
	// Successful case
	t.Run("successful case", func(t *testing.T) {
		mockHandleGetBlogByTagIDs := new(MockHandleGetBlogByTagIDs)
		// Arrange
		req := httptest.NewRequest(http.MethodGet, "/api/blog/date/2025-03-24", nil)
		w := httptest.NewRecorder()
		mockHandleGetBlogByTagIDs.On("MockHandleGetBlogByTagIDs", req).Return(http.StatusOK, nil, []models.Blog{})

		// Act
		response, err, blogs := mockHandleGetBlogByTagIDs.MockHandleGetBlogByTagIDs(w, req)

		// Assert
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, response)
		assert.NotNil(t, blogs)
		mockHandleGetBlogByTagIDs.AssertExpectations(t)
	})
}
