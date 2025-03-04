package controllers // Replace with your actual package name

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockHandleLogin struct {
	mock.Mock
}

type MockHandleRegister struct {
	mock.Mock
}

type MockHandleLogout struct {
	mock.Mock
}

type MockHandleForgotPassword struct {
	mock.Mock
}

type MockHandleResetPassword struct {
	mock.Mock
}

// Mock for services.HandleLogin
func (m *MockHandleLogin) MockHandleLogin(w http.ResponseWriter, r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

// Mock for services.HandleRegister
func (m *MockHandleRegister) MockHandleRegister(r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

// Mock for services.HandleLogout
func (m *MockHandleLogout) MockHandleLogout(r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

func (m *MockHandleForgotPassword) MockHandleForgotPassword(r *http.Request) (error) {
	args := m.Called(r)	
	return args.Error(0)
}

func (m *MockHandleResetPassword) MockHandleResetPassword(r *http.Request) (error) {
	args := m.Called(r)	
	return args.Error(0)
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

func TestLogin(t *testing.T) {
	// Test case 1: Successful login
	t.Run("Successful Login", func(t *testing.T) {
		// Mock dependencies
		mockSuccessHandler := new(MockHandleLogin)

		req := httptest.NewRequest(http.MethodPost, "/login", nil)

		mockSuccessHandler.On("MockHandleLogin", req).Return("Authentication successful", nil, http.StatusOK)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockSuccessHandler.MockHandleLogin(w, req)

		// Assertions
		assert.Equal(t, "Authentication successful", response)
		assert.NoError(t, err)
		assert.Equal(t, 200, statusCode)

		// Verify that the expected call was made
		mockSuccessHandler.AssertExpectations(t)
	})

	// Test case 2: Invalid request format
	t.Run("Invalid Request Format", func(t *testing.T) {
		mockFailureHandler := new(MockHandleLogin)

		req := httptest.NewRequest(http.MethodPost, "/login", nil)

		mockFailureHandler.On("MockHandleLogin", req).Return(nil, errors.New("invalid request format"), http.StatusBadRequest)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockFailureHandler.MockHandleLogin(w, req)

		// Assertions
		assert.Nil(t, response)
		assert.EqualError(t, err, "invalid request format")
		assert.Equal(t, 400, statusCode)

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})

	// Test case 3: Invalid credentials
	t.Run("Invalid Credentials", func(t *testing.T) {
		mockFailureHandler := new(MockHandleLogin)

		req := httptest.NewRequest(http.MethodPost, "/login", nil)

		mockFailureHandler.On("MockHandleLogin", req).Return(nil, errors.New("invalid credentials"), http.StatusUnauthorized)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockFailureHandler.MockHandleLogin(w, req)

		// Assertions
		assert.Nil(t, response)
		assert.EqualError(t, err, "invalid credentials")
		assert.Equal(t, 401, statusCode)

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})
}

func TestRegister(t *testing.T) {
	// Test case 1: Successful registration
	t.Run("Successful Registration", func(t *testing.T) {
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
		mockFailureHandler := new(MockHandleRegister)

		req := httptest.NewRequest(http.MethodPost, "/register", nil)

		mockFailureHandler.On("MockHandleRegister", req).Return(nil, errors.New("Registration Failed"), http.StatusBadRequest)

		// Call the mock method
		response, err, statusCode := mockFailureHandler.MockHandleRegister(req)

		// Assertions
		assert.Nil(t, response)
		assert.EqualError(t, err, "Registration Failed")
		assert.Equal(t, 400, statusCode)

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})

	// Test case 3: email already exists
	t.Run("Email already exists", func(t *testing.T) {
		mockFailureHandler := new(MockHandleRegister)

		req := httptest.NewRequest(http.MethodPost, "/register", nil)

		mockFailureHandler.On("MockHandleRegister", req).Return(nil, errors.New("email already exists"), http.StatusBadRequest)

		// Call the mock method
		response, err, statusCode := mockFailureHandler.MockHandleRegister(req)

		// Assertions
		assert.Nil(t, response)
		assert.EqualError(t, err, "email already exists")
		assert.Equal(t, 400, statusCode)

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})

	// Test case 4: Error hashing password
	t.Run("Hashing error", func(t *testing.T) {
		mockFailureHandler := new(MockHandleRegister)

		req := httptest.NewRequest(http.MethodPost, "/register", nil)

		mockFailureHandler.On("MockHandleRegister", req).Return(nil, errors.New("Error hashing password"), http.StatusInternalServerError)

		// Call the mock method
		response, err, statusCode := mockFailureHandler.MockHandleRegister(req)

		// Assertions
		assert.Nil(t, response)
		assert.EqualError(t, err, "Error hashing password")
		assert.Equal(t, 500, statusCode)

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})

	// Test case 5: Error saving user
	t.Run("Error saving user", func(t *testing.T) {
		mockFailureHandler := new(MockHandleRegister)

		req := httptest.NewRequest(http.MethodPost, "/register", nil)

		mockFailureHandler.On("MockHandleRegister", req).Return(nil, errors.New("Error saving user"), http.StatusBadRequest)

		// Call the mock method
		response, err, statusCode := mockFailureHandler.MockHandleRegister(req)

		// Assertions
		assert.Nil(t, response)
		assert.EqualError(t, err, "Error saving user")
		assert.Equal(t, 400, statusCode)

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})
}

func TestLogout(t *testing.T) {
	// Test case 1: Successful logout
	t.Run("Successful Logout", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleLogout)

		req := httptest.NewRequest(http.MethodPost, "/logout", nil)

		mockSuccessHandler.On("MockHandleLogout", req).Return("Logout successful", nil, http.StatusOK)

		// Call the mock method
		response, err, statusCode := mockSuccessHandler.MockHandleLogout(req)

		// Assertions
		assert.Equal(t, "Logout successful", response)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, statusCode)

		// Verify that the expected call was made
		mockSuccessHandler.AssertExpectations(t)
	})

	// Test case 2: Failed logout
	t.Run("Logout failed", func(t *testing.T) {
		mockFailureHandler := new(MockHandleLogout)

		req := httptest.NewRequest(http.MethodPost, "/logout", nil)

		mockFailureHandler.On("MockHandleLogout", req).Return(nil, errors.New("Failed to logout"), http.StatusUnauthorized)

		// Call the mock method
		response, err, statusCode := mockFailureHandler.MockHandleLogout(req)

		// Assertions
		assert.Nil(t, response)
		assert.EqualError(t, err, "Failed to logout")
		assert.Equal(t, 401, statusCode)

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})

	// Test case 3: Invalid token format
	t.Run("Invalid token format", func(t *testing.T) {
		mockFailureHandler := new(MockHandleLogout)

		req := httptest.NewRequest(http.MethodPost, "/logout", nil)

		mockFailureHandler.On("MockHandleLogout", req).Return(nil, errors.New("invalid token format"), http.StatusUnauthorized)

		// Call the mock method
		response, err, statusCode := mockFailureHandler.MockHandleLogout(req)

		// Assertions
		assert.Nil(t, response)
		assert.EqualError(t, err, "invalid token format")
		assert.Equal(t, 401, statusCode)

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})
}

func TestForgotPassword(t *testing.T) {
	// Test case 1: Successful forgot password	
	t.Run("Successful forgot password", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleForgotPassword)

		req := httptest.NewRequest(http.MethodPost, "/forgot_password", nil)

		mockSuccessHandler.On("MockHandleForgotPassword", req).Return(nil)

		// Call the mock method
		err := mockSuccessHandler.MockHandleForgotPassword(req)	

		// Assertions
		assert.NoError(t, err)
	
		// Verify that the expected call was made
		mockSuccessHandler.AssertExpectations(t)
	})

	// Test case 2: Error resetting password
	t.Run("Error resetting password", func(t *testing.T) {
		mockFailureHandler := new(MockHandleForgotPassword)

		req := httptest.NewRequest(http.MethodPost, "/forgot_password", nil)

		mockFailureHandler.On("MockHandleForgotPassword", req).Return(errors.New("Error resetting password"))

		// Call the mock method
		err := mockFailureHandler.MockHandleForgotPassword(req)

		// Assertions
		assert.EqualError(t, err, "Error resetting password")

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})

	// Test case 3: Method not allowed
	t.Run("Method not allowed", func(t *testing.T) {
		mockFailureHandler := new(MockHandleForgotPassword)

		req := httptest.NewRequest(http.MethodGet, "/forgot_password", nil)

		mockFailureHandler.On("MockHandleForgotPassword", req).Return(errors.New("Method not allowed"))

		// Call the mock method	
		err := mockFailureHandler.MockHandleForgotPassword(req)

		// Assertions	
		assert.EqualError(t, err, "Method not allowed")

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})
}

func TestResetPassword(t *testing.T) {
	// Test case 1: Successful reset password
	t.Run("Successful reset password", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleResetPassword)

		req := httptest.NewRequest(http.MethodPost, "/reset_password", nil)

		mockSuccessHandler.On("MockHandleResetPassword", req).Return(nil)

		// Call the mock method	
		err := mockSuccessHandler.MockHandleResetPassword(req)

		// Assertions	
		assert.NoError(t, err)			

		// Verify that the expected call was made
		mockSuccessHandler.AssertExpectations(t)
	})

	// Test case 2: Token and password are required
	t.Run("Token and password are required", func(t *testing.T) {
		mockFailureHandler := new(MockHandleResetPassword)	

		req := httptest.NewRequest(http.MethodPost, "/reset_password", nil)

		mockFailureHandler.On("MockHandleResetPassword", req).Return(errors.New("Token and password are required"))

		// Call the mock method
		err := mockFailureHandler.MockHandleResetPassword(req)

		// Assertions
		assert.EqualError(t, err, "Token and password are required")

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})

	// Test case 3: Invalid or expired token
	t.Run("Invalid or expired token", func(t *testing.T) {
		mockFailureHandler := new(MockHandleResetPassword)

		req := httptest.NewRequest(http.MethodPost, "/reset_password", nil)

		mockFailureHandler.On("MockHandleResetPassword", req).Return(errors.New("Invalid or expired token"))

		// Call the mock method
		err := mockFailureHandler.MockHandleResetPassword(req)

		// Assertions
		assert.EqualError(t, err, "Invalid or expired token")

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})
}

