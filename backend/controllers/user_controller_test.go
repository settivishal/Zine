package controllers

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"errors"

	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/assert"
)

type MockHandleProfile struct {
	mock.Mock
}

type MockHandleChangePassword struct {
	mock.Mock
}

type MockHandleUpdateImage struct {
	mock.Mock
}

func (m *MockHandleProfile) MockHandleProfile(w http.ResponseWriter, r *http.Request) (interface{}, error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

func (m *MockHandleChangePassword) MockHandleChangePassword(w http.ResponseWriter, r *http.Request) (error, int) {
	args := m.Called(r)
	return args.Error(0), args.Int(1)
}

func (m *MockHandleUpdateImage) MockHandleUpdateImage(w http.ResponseWriter, r *http.Request) (interface{},error, int) {
	args := m.Called(r)
	return args.Get(0), args.Error(1), args.Int(2)
}

func TestGetProfile(t *testing.T) {
	t.Run("Get profile succesfully", func(t *testing.T) {
		// Mock dependencies
		mockSuccessHandler := new(MockHandleProfile)

		req := httptest.NewRequest(http.MethodPost, "/profile", nil)

		mockSuccessHandler.On("MockHandleProfile", req).Return("Welcome user", nil, http.StatusOK)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockSuccessHandler.MockHandleProfile(w, req)

		// Assertions
		assert.Equal(t, "Welcome user", response)
		assert.NoError(t, err)
		assert.Equal(t, 200, statusCode)

		// Verify that the expected call was made
		mockSuccessHandler.AssertExpectations(t)
	})

	t.Run("Get profile failed", func(t *testing.T) {
		// Mock dependencies
		mockFailureHandler := new(MockHandleProfile)	

		req := httptest.NewRequest(http.MethodPost, "/profile", nil)

		mockFailureHandler.On("MockHandleProfile", req).Return(nil, errors.New("Error retrieving profile"), http.StatusUnauthorized)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockFailureHandler.MockHandleProfile(w, req)

		// Assertions
		assert.Nil(t, response)
		assert.EqualError(t, err, "Error retrieving profile")
		assert.Equal(t, 401, statusCode)

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})

	t.Run("Error getting email", func(t *testing.T) {
		// Mock dependencies	
		mockFailureHandler := new(MockHandleProfile)	

		req := httptest.NewRequest(http.MethodPost, "/profile", nil)

		mockFailureHandler.On("MockHandleProfile", req).Return(nil, errors.New("Error getting email"), http.StatusUnauthorized)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockFailureHandler.MockHandleProfile(w, req)	

		// Assertions
		assert.Nil(t, response)
		assert.EqualError(t, err, "Error getting email")
		assert.Equal(t, 401, statusCode)

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})
}

func TestChangePassword(t *testing.T) {
	t.Run("Change password succesfully", func(t *testing.T) {
		// Mock dependencies
		mockSuccessHandler := new(MockHandleChangePassword)

		req := httptest.NewRequest(http.MethodPost, "/password", nil)

		mockSuccessHandler.On("MockHandleChangePassword", req).Return(nil, http.StatusOK)

		// Call the mock method
		w := httptest.NewRecorder()
		err, statusCode := mockSuccessHandler.MockHandleChangePassword(w, req)

		// Assertions
		assert.NoError(t, err)
		assert.Equal(t, 200, statusCode)

		// Verify that the expected call was made
		mockSuccessHandler.AssertExpectations(t)
	})

	t.Run("Change password failed", func(t *testing.T) {
		// Mock dependencies
		mockFailureHandler := new(MockHandleChangePassword)	

		req := httptest.NewRequest(http.MethodPost, "/password", nil)

		mockFailureHandler.On("MockHandleChangePassword", req).Return(errors.New("Error retrieving profile"), http.StatusUnauthorized)

		// Call the mock method
		w := httptest.NewRecorder()
		err, statusCode := mockFailureHandler.MockHandleChangePassword(w, req)

		// Assertions
		assert.EqualError(t, err, "Error retrieving profile")
		assert.Equal(t, 401, statusCode)

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})

	t.Run("Error getting email", func(t *testing.T) {
		// Mock dependencies	
		mockFailureHandler := new(MockHandleChangePassword)	

		req := httptest.NewRequest(http.MethodPost, "/password", nil)

		mockFailureHandler.On("MockHandleChangePassword", req).Return(errors.New("Error getting email"), http.StatusUnauthorized)

		// Call the mock method
		w := httptest.NewRecorder()
		err, statusCode := mockFailureHandler.MockHandleChangePassword(w, req)	

		// Assertions
		assert.EqualError(t, err, "Error getting email")
		assert.Equal(t, 401, statusCode)

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})
}

func TestUpdateImage(t *testing.T) {
	t.Run("Update image successfully", func(t *testing.T) {
		// Mock dependencies
		mockSuccessHandler := new(MockHandleUpdateImage)

		req := httptest.NewRequest(http.MethodPost, "/image", nil)

		mockSuccessHandler.On("MockHandleUpdateImage", req).Return("Image updated successfully", nil, http.StatusOK)	

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockSuccessHandler.MockHandleUpdateImage(w, req)

		// Assertions
		assert.Equal(t, "Image updated successfully", response)
		assert.NoError(t, err)	
		assert.Equal(t, 200, statusCode)

		// Verify that the expected call was made
		mockSuccessHandler.AssertExpectations(t)
	})

	t.Run("Fetching image failed", func(t *testing.T) {
		// Mock dependencies
		mockFailureHandler := new(MockHandleUpdateImage)

		req := httptest.NewRequest(http.MethodPost, "/image", nil)	

		mockFailureHandler.On("MockHandleUpdateImage", req).Return(nil, errors.New("Error getting image"), http.StatusBadRequest)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockFailureHandler.MockHandleUpdateImage(w, req)

		// Assertions
		assert.Nil(t, response)
		assert.EqualError(t, err, "Error getting image")
		assert.Equal(t, 400, statusCode)

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})

	t.Run("Error updating image", func(t *testing.T) {
		// Mock dependencies
		mockFailureHandler := new(MockHandleUpdateImage)

		req := httptest.NewRequest(http.MethodPost, "/image", nil)

		mockFailureHandler.On("MockHandleUpdateImage", req).Return(nil, errors.New("Error updating image"), http.StatusBadRequest)

		// Call the mock method
		w := httptest.NewRecorder()
		response, err, statusCode := mockFailureHandler.MockHandleUpdateImage(w, req)	

		// Assertions	
		assert.Nil(t, response)	
		assert.EqualError(t, err, "Error updating image")
		assert.Equal(t, 400, statusCode)

		// Verify that the expected call was made
		mockFailureHandler.AssertExpectations(t)
	})
}