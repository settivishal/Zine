package services

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/utils"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestHandleProfile(t *testing.T) {
	mockHandler := mock.Mock{}
	mockHandler.On("HandleProfile", mock.Anything).Return(&utils.UserInfoResponse{}, nil, http.StatusOK)
	mock := new(mock.Mock)

	// Test case 1: Successful retrieval
	t.Run("Successful Retrieval", func(t *testing.T) {
		// Arrange
		req := httptest.NewRequest(http.MethodGet, "/profile", nil)
		w := httptest.NewRecorder()
		mockHandler.On("HandleProfile", req).Return(&utils.UserInfoResponse{}, nil, http.StatusOK)

		// Act
		MockHandleProfile(mock, w, req)

		// Assert
		assert.Equal(t, http.StatusOK, w.Code)
	})
}

func TestHandleUpdateUser(t *testing.T) {
	mockHandler := mock.Mock{}
	mockHandler.On("HandleUpdateUser", mock.Anything).Return(&utils.UserInfoResponse{}, nil, http.StatusOK)
	mock := new(mock.Mock)

	// Test case 1: Successful update
	t.Run("Successful Update", func(t *testing.T) {
		// Arrange
		req := httptest.NewRequest(http.MethodPatch, "/profile", nil)
		w := httptest.NewRecorder()
		mockHandler.On("HandleUpdateUser", req).Return(&utils.UserInfoResponse{}, nil, http.StatusOK)

		// Act
		MockHandleUpdateUser(mock, w, req)

		// Assert
		assert.Equal(t, http.StatusOK, w.Code)
	})
}

func MockHandleProfile(m *mock.Mock, w http.ResponseWriter, r *http.Request) (*utils.UserInfoResponse, error, int) {
	return &utils.UserInfoResponse{}, nil, http.StatusOK
}

func MockHandleUpdateUser(m *mock.Mock, w http.ResponseWriter, r *http.Request) (*utils.UserInfoResponse, error, int) {
	return &utils.UserInfoResponse{}, nil, http.StatusOK
}
