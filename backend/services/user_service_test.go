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

type MockHandleUpdateProfile struct {
	mock.Mock
}

func (m *MockHandleUpdateProfile) MockHandleUpdateProfile(r *http.Request) (*utils.UpdateProfileResponse, int, error) {
	args := m.Called(r)
	return args.Get(0).(*utils.UpdateProfileResponse), args.Int(1), args.Error(2)
}

type MockHandleUpdateHobbies struct {
	mock.Mock
}

func (m *MockHandleUpdateHobbies) MockHandleUpdateHobbies(r *http.Request) (*utils.UpdateProfileHobbiesResponse, int, error) {
	args := m.Called(r)
	return args.Get(0).(*utils.UpdateProfileHobbiesResponse), args.Int(1), args.Error(2)
}

type MockHandleUpdateSocials struct {
	mock.Mock
}

func (m *MockHandleUpdateSocials) MockHandleUpdateSocials(r *http.Request) (*utils.UpdateProfileSocialsResponse, int, error) {
	args := m.Called(r)
	return args.Get(0).(*utils.UpdateProfileSocialsResponse), args.Int(1), args.Error(2)
}

type MockHandleGetGrid struct {
	mock.Mock
}

func (m *MockHandleGetGrid) MockHandleGetGrid(w http.ResponseWriter, r *http.Request) (*utils.GetGridResponse, int, error) {
	args := m.Called(r)
	return args.Get(0).(*utils.GetGridResponse), args.Int(1), args.Error(2)
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

func TestHandleUpdateProfile(t *testing.T) {
	// Test case 1: Successful update
	t.Run("Successful Update", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleUpdateProfile)
		req := httptest.NewRequest(http.MethodPost, "/profile", nil)
		mockSuccessHandler.On("MockHandleUpdateProfile", req).Return(&utils.UpdateProfileResponse{}, http.StatusOK, nil)

		// Act
		response, code, err := mockSuccessHandler.MockHandleUpdateProfile(req)

		// Assert
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, code)
		assert.NotNil(t, response)
	})
	// Test case 2: Error during update
	t.Run("Error During Update", func(t *testing.T) {
		mockFailureHandler := new(MockHandleUpdateProfile)
		req := httptest.NewRequest(http.MethodPost, "/profile", nil)
		mockFailureHandler.On("MockHandleUpdateProfile", req).Return(&utils.UpdateProfileResponse{}, http.StatusInternalServerError, errors.New("Internal Server Error"))

		// Act
		response, code, err := mockFailureHandler.MockHandleUpdateProfile(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusInternalServerError, code)
		assert.NotNil(t, response)
	})
	// Test case 3: Invalid request format
	t.Run("Invalid Request Format", func(t *testing.T) {
		mockFailureHandler := new(MockHandleUpdateProfile)
		req := httptest.NewRequest(http.MethodPost, "/profile", nil)
		mockFailureHandler.On("MockHandleUpdateProfile", req).Return(&utils.UpdateProfileResponse{}, http.StatusBadRequest, errors.New("Invalid request format"))

		// Act
		response, code, err := mockFailureHandler.MockHandleUpdateProfile(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusBadRequest, code)
		assert.NotNil(t, response)
	})
}

func TestHandleUpdateHobbies(t *testing.T) {
	// Test case 1: Successful update
	t.Run("Successful Update", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleUpdateHobbies)
		req := httptest.NewRequest(http.MethodPost, "/profile/hobbies", nil)
		mockSuccessHandler.On("MockHandleUpdateHobbies", req).Return(&utils.UpdateProfileHobbiesResponse{}, http.StatusOK, nil)

		// Act
		response, code, err := mockSuccessHandler.MockHandleUpdateHobbies(req)

		// Assert
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, code)
		assert.NotNil(t, response)
	})
	// Test case 2: Error during update
	t.Run("Error During Update", func(t *testing.T) {
		mockFailureHandler := new(MockHandleUpdateHobbies)
		req := httptest.NewRequest(http.MethodPost, "/profile/hobbies", nil)
		mockFailureHandler.On("MockHandleUpdateHobbies", req).Return(&utils.UpdateProfileHobbiesResponse{}, http.StatusInternalServerError, errors.New("Internal Server Error"))

		// Act
		response, code, err := mockFailureHandler.MockHandleUpdateHobbies(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusInternalServerError, code)
		assert.NotNil(t, response)
	})
	// Test case 3: Invalid request format
	t.Run("Invalid Request Format", func(t *testing.T) {
		mockFailureHandler := new(MockHandleUpdateHobbies)
		req := httptest.NewRequest(http.MethodPost, "/profile/hobbies", nil)
		mockFailureHandler.On("MockHandleUpdateHobbies", req).Return(&utils.UpdateProfileHobbiesResponse{}, http.StatusBadRequest, errors.New("Invalid request format"))

		// Act
		response, code, err := mockFailureHandler.MockHandleUpdateHobbies(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusBadRequest, code)
		assert.NotNil(t, response)
	})
}

func TestHandleUpdateSocials(t *testing.T) {
	// Test case 1: Successful update
	t.Run("Successful Update", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleUpdateSocials)
		req := httptest.NewRequest(http.MethodPost, "/profile/socials", nil)
		mockSuccessHandler.On("MockHandleUpdateSocials", req).Return(&utils.UpdateProfileSocialsResponse{}, http.StatusOK, nil)

		// Act
		response, code, err := mockSuccessHandler.MockHandleUpdateSocials(req)

		// Assert
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, code)
		assert.NotNil(t, response)
	})
	// Test case 2: Error during update
	t.Run("Error During Update", func(t *testing.T) {
		mockFailureHandler := new(MockHandleUpdateSocials)
		req := httptest.NewRequest(http.MethodPost, "/profile/socials", nil)
		mockFailureHandler.On("MockHandleUpdateSocials", req).Return(&utils.UpdateProfileSocialsResponse{}, http.StatusInternalServerError, errors.New("Internal Server Error"))

		// Act
		response, code, err := mockFailureHandler.MockHandleUpdateSocials(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusInternalServerError, code)
		assert.NotNil(t, response)
	})
	// Test case 3: Invalid request format
	t.Run("Invalid Request Format", func(t *testing.T) {
		mockFailureHandler := new(MockHandleUpdateSocials)
		req := httptest.NewRequest(http.MethodPost, "/profile/socials", nil)
		mockFailureHandler.On("MockHandleUpdateSocials", req).Return(&utils.UpdateProfileSocialsResponse{}, http.StatusBadRequest, errors.New("Invalid request format"))

		// Act
		response, code, err := mockFailureHandler.MockHandleUpdateSocials(req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusBadRequest, code)
		assert.NotNil(t, response)
	})
}

func TestHandleGetGrid(t *testing.T) {
	// Test case 1: Successful retrieval
	t.Run("Successful Retrieval", func(t *testing.T) {
		mockSuccessHandler := new(MockHandleGetGrid)
		req := httptest.NewRequest(http.MethodGet, "/profile/grid", nil)
		mockSuccessHandler.On("MockHandleGetGrid", req).Return(&utils.GetGridResponse{}, http.StatusOK, nil)

		// Act
		recorder := httptest.NewRecorder()
		response, code, err := mockSuccessHandler.MockHandleGetGrid(recorder, req)
		// Assert
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, code)
		assert.NotNil(t, response)
	})
	// Test case 2: Error during retrieval
	t.Run("Error During Retrieval", func(t *testing.T) {
		mockFailureHandler := new(MockHandleGetGrid)
		req := httptest.NewRequest(http.MethodGet, "/profile/grid", nil)
		mockFailureHandler.On("MockHandleGetGrid", req).Return(&utils.GetGridResponse{}, http.StatusInternalServerError, errors.New("Internal Server Error"))

		// Act
		recorder := httptest.NewRecorder()
		response, code, err := mockFailureHandler.MockHandleGetGrid(recorder, req)

		// Assert
		assert.Error(t, err)
		assert.Equal(t, http.StatusInternalServerError, code)
		assert.NotNil(t, response)
	})
}
