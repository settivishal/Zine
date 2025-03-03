package services

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/utils"
	"errors"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockHandleProfile struct {
	mock.Mock
}

func (m *MockHandleProfile) MockHandleProfile(r *http.Request) (*utils.UserInfoResponse, int, error) {
	args := m.Called(r)
	return args.Get(0).(*utils.UserInfoResponse), args.Int(1), args.Error(2)
}

type MockHandleUpdateImage struct {
	mock.Mock
}

func (m *MockHandleUpdateImage) MockHandleUpdateImage(r *http.Request) (*utils.UpdateImageResponse, int, error) {
	args := m.Called(r)
	return args.Get(0).(*utils.UpdateImageResponse), args.Int(1), args.Error(2)
}

func TestHandleProfile(t *testing.T) {
	// Test case 1: Successful retrieval
	t.Run("Successful Retrieval", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleProfile)
		req := httptest.NewRequest(http.MethodGet, "/profile", nil)
		mockSuccessHandler.On("MockHandleProfile", req).Return(&utils.UserInfoResponse{}, http.StatusOK, nil)

		// Act
		response, code, err := mockSuccessHandler.MockHandleProfile(req)

		// Assert
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, code)
		assert.NotNil(t, response)
	})
	// Test case 2: Error during retrieval
	t.Run("Error During Retrieval", func(t *testing.T) {
		mockFailureHandler := new(MockHandleProfile)
		req := httptest.NewRequest(http.MethodGet, "/profile", nil)
		mockFailureHandler.On("MockHandleProfile", req).Return(&utils.UserInfoResponse{}, http.StatusInternalServerError, errors.New("Internal Server Error"))

		// Act
		response, code, err := mockFailureHandler.MockHandleProfile(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusInternalServerError, code)
		assert.NotNil(t, response)
	})

	// Test case 3: Invalid request format
	t.Run("Invalid Request Format", func(t *testing.T) {
		mockFailureHandler := new(MockHandleProfile)
		req := httptest.NewRequest(http.MethodGet, "/profile", nil)
		mockFailureHandler.On("MockHandleProfile", req).Return(&utils.UserInfoResponse{}, http.StatusBadRequest, errors.New("Invalid request format"))

		// Act
		response, code, err := mockFailureHandler.MockHandleProfile(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusBadRequest, code)
		assert.NotNil(t, response)
	})
	// Test case 4: User not found
	t.Run("User Not Found", func(t *testing.T) {
		mockFailureHandler := new(MockHandleProfile)
		req := httptest.NewRequest(http.MethodGet, "/profile", nil)
		mockFailureHandler.On("MockHandleProfile", req).Return(&utils.UserInfoResponse{}, http.StatusNotFound, errors.New("User not found"))

		// Act
		response, code, err := mockFailureHandler.MockHandleProfile(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusNotFound, code)
		assert.NotNil(t, response)
	})
}

func TestHandleUpdateImage(t *testing.T) {
	// Test case 1: Successful update
	t.Run("Successful Update", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleUpdateImage)
		req := httptest.NewRequest(http.MethodPost, "/profile/image", nil)
		mockSuccessHandler.On("MockHandleUpdateImage", req).Return(&utils.UpdateImageResponse{}, http.StatusOK, nil)

		// Act
		response, code, err := mockSuccessHandler.MockHandleUpdateImage(req)

		// Assert
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, code)
		assert.NotNil(t, response)
	})
	// Test case 2: Error during update
	t.Run("Error During Update", func(t *testing.T) {
		mockFailureHandler := new(MockHandleUpdateImage)
		req := httptest.NewRequest(http.MethodPost, "/profile/image", nil)
		mockFailureHandler.On("MockHandleUpdateImage", req).Return(&utils.UpdateImageResponse{}, http.StatusInternalServerError, errors.New("Internal Server Error"))

		// Act
		response, code, err := mockFailureHandler.MockHandleUpdateImage(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusInternalServerError, code)
		assert.NotNil(t, response)
	})
	// Test case 3: Invalid request format
	t.Run("Invalid Request Format", func(t *testing.T) {
		mockFailureHandler := new(MockHandleUpdateImage)
		req := httptest.NewRequest(http.MethodPost, "/profile/image", nil)
		mockFailureHandler.On("MockHandleUpdateImage", req).Return(&utils.UpdateImageResponse{}, http.StatusBadRequest, errors.New("Invalid request format"))

		// Act
		response, code, err := mockFailureHandler.MockHandleUpdateImage(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusBadRequest, code)
		assert.NotNil(t, response)
	})
}
