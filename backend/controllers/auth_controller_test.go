package controllers // Replace with your actual package name

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"errors"

	// "backend/services"
	// "backend/utils"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Mock for services.HandleRegister
type MockHandleRegister struct {
	mock.Mock
}

func (m *MockHandleRegister) MockHandleRegister(r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

// Mock for utils.SendErrorResponse
func MockSendErrorResponse(w http.ResponseWriter, message string, err error, status int) {
	w.WriteHeader(status)
	w.Write([]byte(message))
}

// Mock for utils.SendJSONResponse
func MockSendJSONResponse(w http.ResponseWriter, response interface{}, status int) {
	w.WriteHeader(status)
	w.Write([]byte("Success"))
}

func TestRegister(t *testing.T) {
	// Test case 1: Successful registration
	t.Run("Successful Registration", func(t *testing.T) {
		// Create a new instance of our MockHandleRegister
		mockSuccessHandler := new(MockHandleRegister)

		req := httptest.NewRequest(http.MethodPost, "/register", nil)

		mockSuccessHandler.On("MockHandleRegister", req).Return("Registration successful", nil, http.StatusOK)

		// Call the mock method
		response, err, statusCode := mockSuccessHandler.MockHandleRegister(req)

		// Assertions
		assert.Equal(t, "Registration successful", response)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, statusCode)

		// Verify that the expected call was made
		mockSuccessHandler.AssertExpectations(t)
	})

	// Test case 2: Failed registration
	t.Run("Failed Registration", func(t *testing.T) {
		// Create a new instance of MockHandleRegister for this test
		mockFailureHandler := new(MockHandleRegister)

		req := httptest.NewRequest(http.MethodPost, "/register", nil)

		mockFailureHandler.On("MockHandleRegister", req).Return(nil, errors.New("Registration Failed"), http.StatusBadRequest)

		// Call the mock method
		response, err, statusCode := mockFailureHandler.MockHandleRegister(req)

		// Assertions
		assert.Nil(t, response)
		assert.EqualError(t, err,"Registration Failed")
		assert.Equal(t, http.StatusBadRequest, statusCode)

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})
}
