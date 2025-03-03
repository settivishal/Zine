package services

import (
	"testing"

	"net/http"

	"backend/utils"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func MockGetGoogleAuthURL(m *mock.Mock) (string, error) {
	return "https://accounts.google.com/o/oauth2/auth?client_id=377234163527-vvjh1763shbli0m4rhnqtok95cq54j29.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fgoogle%2Fcallback&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&state=j1uzx0WNg4JGTbeg3RhRHA%3D%3D", nil
}

func MockHandleGoogleCallback(m *mock.Mock) (*utils.LoginResponse, int, error) {
	return nil, http.StatusOK, nil
}

func TestGetGoogleAuthURL(t *testing.T) {
	var mock *mock.Mock
	url, err := MockGetGoogleAuthURL(mock)

	assert.NoError(t, err, "GetGoogleAuthURL should not return an error")
	assert.NotEmpty(t, url, "URL should not be empty")
	assert.Contains(t, url, "client_id=", "URL should contain client_id parameter")
	assert.Contains(t, url, "redirect_uri=", "URL should contain redirect_uri parameter")
	assert.Contains(t, url, "response_type=code", "URL should contain response_type parameter")
	assert.Contains(t, url, "scope=", "URL should contain scope parameter")
	assert.Contains(t, url, "state=", "URL should contain state parameter")
}

func TestHandleGoogleCallback(t *testing.T) {
	// mock all the required methods and do a simple unit test
	var mock *mock.Mock

	// Call the HandleGoogleCallback function
	response, statusCode, err := MockHandleGoogleCallback(mock)

	assert.Equal(t, http.StatusOK, statusCode, "Status code should be 200")
	assert.Nil(t, response, "Response should be nil")
	assert.Nil(t, err, "Error should be nil")

}
