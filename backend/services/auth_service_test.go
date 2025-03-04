package services

import (
	"testing"

	"backend/utils"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"

	"errors"

	"net/http"
	"net/http/httptest"
)

type MockHandleLogin struct {
	mock.Mock
}

func (m *MockHandleLogin) MockHandleLogin(r *http.Request) (*utils.LoginResponse, error, int) {
	args := m.Called(r)
	return args.Get(0).(*utils.LoginResponse), args.Error(1), args.Int(2)
}

type MockHandleRegister struct {
	mock.Mock
}

func (m *MockHandleRegister) MockHandleRegister(r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

type MockHandleLogout struct {
	mock.Mock
}

func (m *MockHandleLogout) MockHandleLogout(w http.ResponseWriter, r *http.Request) (int, error) {
	args := m.Called(r)
	return args.Int(0), args.Error(1)
}

type MockHandleChangePassword struct {
	mock.Mock
}

func (m *MockHandleChangePassword) MockHandleChangePassword(r *http.Request) (error, int) {
	args := m.Called(r)
	return args.Error(0), args.Int(1)
}

func TestGenerateTokens(t *testing.T) {
	email := "test@example.com"

	token, refreshToken, _ := GenerateTokens(utils.Credentials{Email: email}, nil)
	assert.NotEmpty(t, token)
	assert.NotEmpty(t, refreshToken)
}

func TestHandleLogin(t *testing.T) {
	// Test Case 1: Successful Login
	t.Run("Successful Login", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleLogin)
		req := httptest.NewRequest(http.MethodPost, "/login", nil)
		mockSuccessHandler.On("MockHandleLogin", req).Return(&utils.LoginResponse{}, nil, http.StatusOK)

		// Act
		response, err, code := mockSuccessHandler.MockHandleLogin(req)

		// Assert
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, code)
		assert.NotNil(t, response)

		mockSuccessHandler.AssertExpectations(t)
	})

	// Test Case 2: Invalid request format
	t.Run("Invalid Request Format", func(t *testing.T) {
		mockFailureHandler := new(MockHandleLogin)
		req := httptest.NewRequest(http.MethodPost, "/login", nil)
		mockFailureHandler.On("MockHandleLogin", req).Return(&utils.LoginResponse{}, errors.New("Invalid request format"), http.StatusBadRequest)

		// Act
		response, err, code := mockFailureHandler.MockHandleLogin(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusBadRequest, code)
		assert.NotNil(t, response)

		mockFailureHandler.AssertExpectations(t)
	})

	// Test Case 3: User not found
	t.Run("User Not Found", func(t *testing.T) {
		mockFailureHandler := new(MockHandleLogin)
		req := httptest.NewRequest(http.MethodPost, "/login", nil)
		mockFailureHandler.On("MockHandleLogin", req).Return(&utils.LoginResponse{}, errors.New("User not found"), http.StatusNotFound)

		// Act
		response, err, code := mockFailureHandler.MockHandleLogin(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusNotFound, code)
		assert.NotNil(t, response)

		mockFailureHandler.AssertExpectations(t)
	})

	// Test Case 4: Invalid credentials
	t.Run("Invalid Credentials", func(t *testing.T) {
		mockFailureHandler := new(MockHandleLogin)
		req := httptest.NewRequest(http.MethodPost, "/login", nil)
		mockFailureHandler.On("MockHandleLogin", req).Return(&utils.LoginResponse{}, errors.New("Invalid credentials"), http.StatusUnauthorized)

		// Act
		response, err, code := mockFailureHandler.MockHandleLogin(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusUnauthorized, code)
		assert.NotNil(t, response)

		mockFailureHandler.AssertExpectations(t)
	})

	// Test Case 5: Server error
	t.Run("Server Error", func(t *testing.T) {
		mockFailureHandler := new(MockHandleLogin)
		req := httptest.NewRequest(http.MethodPost, "/login", nil)
		mockFailureHandler.On("MockHandleLogin", req).Return(&utils.LoginResponse{}, errors.New("Server error"), http.StatusInternalServerError)

		// Act
		response, err, code := mockFailureHandler.MockHandleLogin(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusInternalServerError, code)
		assert.NotNil(t, response)

		mockFailureHandler.AssertExpectations(t)
	})
}

// TestHandleRegister tests the HandleRegister function
func TestHandleRegister(t *testing.T) {
	// Test Case 1: Successful Registration
	t.Run("Successful Registration", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleRegister)
		req := httptest.NewRequest(http.MethodPost, "/register", nil)
		mockSuccessHandler.On("MockHandleRegister", req).Return("Success", nil, http.StatusOK)

		// Act
		response, err, code := mockSuccessHandler.MockHandleRegister(req)

		// Assert
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, code)
		assert.Equal(t, "Success", response)

		mockSuccessHandler.AssertExpectations(t)
	})

	// Test Case 2: Invalid request format
	t.Run("Invalid Request Format", func(t *testing.T) {
		mockFailureHandler := new(MockHandleRegister)
		req := httptest.NewRequest(http.MethodPost, "/register", nil)
		mockFailureHandler.On("MockHandleRegister", req).Return(nil, errors.New("Invalid request format"), http.StatusBadRequest)

		// Act
		response, err, code := mockFailureHandler.MockHandleRegister(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusBadRequest, code)
		assert.Nil(t, response)

		mockFailureHandler.AssertExpectations(t)
	})

	// Test Case 3: User already exists
	t.Run("User Already Exists", func(t *testing.T) {
		mockFailureHandler := new(MockHandleRegister)
		req := httptest.NewRequest(http.MethodPost, "/register", nil)
		mockFailureHandler.On("MockHandleRegister", req).Return(nil, errors.New("User already exists"), http.StatusConflict)

		// Act
		response, err, code := mockFailureHandler.MockHandleRegister(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusConflict, code)
		assert.Nil(t, response)

		mockFailureHandler.AssertExpectations(t)
	})

	// Test Case 4: Server error
	t.Run("Server Error", func(t *testing.T) {
		mockFailureHandler := new(MockHandleRegister)
		req := httptest.NewRequest(http.MethodPost, "/register", nil)
		mockFailureHandler.On("MockHandleRegister", req).Return(nil, errors.New("Server error"), http.StatusInternalServerError)

		// Act
		response, err, code := mockFailureHandler.MockHandleRegister(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusInternalServerError, code)
		assert.Nil(t, response)

		mockFailureHandler.AssertExpectations(t)
	})
}

// TestHandleLogout tests the HandleLogout function
func TestHandleLogout(t *testing.T) {
	// Test Case 1: Successful Logout
	t.Run("Successful Logout", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleLogout)
		req := httptest.NewRequest(http.MethodPost, "/logout", nil)
		mockSuccessHandler.On("MockHandleLogout", req).Return(http.StatusOK, nil)
		w := httptest.NewRecorder()

		// Act
		code, err := mockSuccessHandler.MockHandleLogout(w, req)

		// Assert
		assert.Nil(t, err)
		assert.Equal(t, http.StatusOK, code)
	})

	// Test Case 2: Missing token
	t.Run("Missing Token", func(t *testing.T) {
		mockFailureHandler := new(MockHandleLogout)
		req := httptest.NewRequest(http.MethodPost, "/logout", nil)
		mockFailureHandler.On("MockHandleLogout", req).Return(http.StatusUnauthorized, errors.New("Missing token"))
		w := httptest.NewRecorder()

		// Act
		code, err := mockFailureHandler.MockHandleLogout(w, req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusUnauthorized, code)
	})

	// Test Case 3: Invalid token format
	t.Run("Invalid Token Format", func(t *testing.T) {
		mockFailureHandler := new(MockHandleLogout)
		req := httptest.NewRequest(http.MethodPost, "/logout", nil)
		mockFailureHandler.On("MockHandleLogout", req).Return(http.StatusUnauthorized, errors.New("Invalid token format"))
		w := httptest.NewRecorder()

		// Act
		code, err := mockFailureHandler.MockHandleLogout(w, req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusUnauthorized, code)
	})
}

// TestHandleChangePassword tests the HandleChangePassword function
func TestHandleChangePassword(t *testing.T) {
	// Test Case 1: Successful Change Password
	t.Run("Successful Change Password", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleChangePassword)
		req := httptest.NewRequest(http.MethodPost, "/change-password", nil)
		mockSuccessHandler.On("MockHandleChangePassword", req).Return(nil, http.StatusOK)

		// Act
		err, code := mockSuccessHandler.MockHandleChangePassword(req)

		// Assert
		assert.Nil(t, err)
		assert.Equal(t, http.StatusOK, code)
	})

	// Test Case 2: Invalid request format
	t.Run("Invalid Request Format", func(t *testing.T) {
		mockFailureHandler := new(MockHandleChangePassword)
		req := httptest.NewRequest(http.MethodPost, "/change-password", nil)
		mockFailureHandler.On("MockHandleChangePassword", req).Return(errors.New("Invalid request format"), http.StatusBadRequest)

		// Act
		err, code := mockFailureHandler.MockHandleChangePassword(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusBadRequest, code)
	})

	// Test Case 3: Incorrect current password
	t.Run("Incorrect Current Password", func(t *testing.T) {
		mockFailureHandler := new(MockHandleChangePassword)
		req := httptest.NewRequest(http.MethodPost, "/change-password", nil)
		mockFailureHandler.On("MockHandleChangePassword", req).Return(errors.New("Incorrect current password"), http.StatusUnauthorized)

		// Act
		err, code := mockFailureHandler.MockHandleChangePassword(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusUnauthorized, code)
	})

	// Test Case 4: Server error
	t.Run("Server Error", func(t *testing.T) {
		mockFailureHandler := new(MockHandleChangePassword)
		req := httptest.NewRequest(http.MethodPost, "/change-password", nil)
		mockFailureHandler.On("MockHandleChangePassword", req).Return(errors.New("Server error"), http.StatusInternalServerError)

		// Act
		err, code := mockFailureHandler.MockHandleChangePassword(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusInternalServerError, code)
	})
}
