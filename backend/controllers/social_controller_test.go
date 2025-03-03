package controllers

import (
	"net/http"
	"net/http/httptest"	
	"testing"
	"errors"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockGetGoogleAuthURL struct {
	mock.Mock	
}

type MockHandleGoogleCallback struct {
	mock.Mock	
}

func (m *MockGetGoogleAuthURL) MockGetGoogleAuthURL(r *http.Request) (string, error) {
	args := m.Called(r)
	return args.String(0), args.Error(1)
}

func (m *MockHandleGoogleCallback) HandleGoogleCallback(w http.ResponseWriter, r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

func TestGoogleLogin(t *testing.T) {
	t.Run("Successful Login", func(t *testing.T) {
		// Mock dependencies
		mockSuccessHandler := new(MockGetGoogleAuthURL)

		req := httptest.NewRequest(http.MethodPost, "/google", nil)

		mockSuccessHandler.On("MockGetGoogleAuthURL", mock.Anything).Return("Authentication successful", nil)

		// Call the mock method
		response, err := mockSuccessHandler.MockGetGoogleAuthURL(req)

		// Assertions
		assert.Equal(t, "Authentication successful", response)
		assert.NoError(t, err)

		// Verify that the expected call was made
		mockSuccessHandler.AssertExpectations(t)
	})

	t.Run("Failed Login", func(t *testing.T) {
		// Mock dependencies
		mockFailureHandler := new(MockGetGoogleAuthURL)

		req := httptest.NewRequest(http.MethodPost, "/google", nil)

		mockFailureHandler.On("MockGetGoogleAuthURL", mock.Anything).Return("", errors.New("Failed to generate random state"))

		// Call the mock method
		response, err := mockFailureHandler.MockGetGoogleAuthURL(req)

		// Assertions
		assert.Equal(t, response, "")
		assert.EqualError(t, err, "Failed to generate random state")	

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})
}

func TestGoogleCallback(t *testing.T) {
	t.Run("Successful Callback", func(t *testing.T) {
		// Mock dependencies
		mockSuccessHandler := new(MockHandleGoogleCallback)

		req := httptest.NewRequest(http.MethodPost, "/google/callback", nil)

		mockSuccessHandler.On("HandleGoogleCallback", mock.Anything).Return("Registration successful", nil, http.StatusOK)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockSuccessHandler.HandleGoogleCallback(w, req)

		// Assertions
		assert.Equal(t, response, "Registration successful")
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, statusCode)

		// Verify that the expected call was made
		mockSuccessHandler.AssertExpectations(t)
	})

	t.Run("Failed Callback", func(t *testing.T) {
		// Mock dependencies
		mockFailureHandler := new(MockHandleGoogleCallback)

		req := httptest.NewRequest(http.MethodPost, "/google/callback", nil)

		mockFailureHandler.On("HandleGoogleCallback", mock.Anything).Return(nil, errors.New("Google authentication failed"), http.StatusInternalServerError)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockFailureHandler.HandleGoogleCallback(w, req)

		// Assertions
		assert.Nil(t, response)
		assert.EqualError(t, err, "Google authentication failed")
		assert.Equal(t, http.StatusInternalServerError, statusCode)

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})
}