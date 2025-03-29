package utils

import (
	"time"

	"backend/models"

	"github.com/golang-jwt/jwt/v5"
)

type Credentials struct {
	Name     string `json:"name"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type Claims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

type RegisterResponse struct {
	Message string `json:"message"`
	Email   string `json:"email"`
	Name    string `json:"name"`
}
type UserInfoResponse struct {
	Message      string   `json:"message"`
	Email        string   `json:"email"`
	Name         string   `json:"name"`
	Image        string   `json:"image"`
	Bio          string   `json:"bio"`
	Age          int64    `json:"age"`
	Gender       string   `json:"gender"`
	Hobbies      []string `json:"hobbies"`
	InstagramUrl string   `json:"instagram_url"`
	TwitterUrl   string   `json:"twitter_url"`
	RedditUrl    string   `json:"reddit_url"`
	LinkedinUrl  string   `json:"linkedin_url"`
}

type LoginResponse struct {
	Message      string    `json:"message"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	AccessToken  string    `json:"access_token"`
	RefreshToken string    `json:"refresh_token"`
	ExpiresAt    time.Time `json:"expires_at"`
}

type ErrorResponse struct {
	Message string `json:"message"`
	Error   string `json:"error"`
}

type GoogleUser struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Picture string `json:"picture"`
	Name    string `json:"name"`
}

type LogoutResponse struct {
	Message string `json:"message"`
}

type ChangePasswordCredentials struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	NewPassword string `json:"new_password"`
}

type ChangePasswordResponse struct {
	Message string `json:"message"`
}

type Tag struct {
	Text  string `json:"text"`
	Color string `json:"color"`
}

type TagResponse struct {
	Message string `json:"message"`
}

type SetTag struct {
	Text string `json:"text"`
	Date string `json:"date"`
}

type UpdateImageResponse struct {
	Message string `json:"message"`
	Image   string `json:"image"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email"`
}

type ResetPasswordRequest struct {
	Token    string `json:"token"`
	Password string `json:"password"`
}

type ForgotPasswordResponse struct {
	Message string `json:"message"`
}

type UpdateProfileRequest struct {
	Name   *string `json:"name,omitempty"`
	Bio    *string `json:"bio,omitempty"`
	Age    *int64  `json:"age,omitempty"`
	Gender *string `json:"gender,omitempty"`
}

type UpdateProfileResponse struct {
	Message string `json:"message"`
}

type UpdateProfileHobbiesRequest struct {
	Hobbies []string `json:"hobbies"`
}

type UpdateProfileHobbiesResponse struct {
	Message string `json:"message"`
}

type UpdateProfileSocialsRequest struct {
	InstagramUrl *string `json:"instagram_url,omitempty"`
	TwitterUrl   *string `json:"twitter_url,omitempty"`
	RedditUrl    *string `json:"reddit_url,omitempty"`
	LinkedinUrl  *string `json:"linkedin_url,omitempty"`
}

type UpdateProfileSocialsResponse struct {
	Message string `json:"message"`
}

type CreateBlogRequest struct {
	Date string `json:"date"`
}

type CreateBlogResponse struct {
	Message string `json:"message"`
	BlogUrl string `json:"blog_url"`
}

type SaveBlogContentRequest struct {
	BlogId  string                 `json:"blog_id"`
	Content map[string]interface{} `json:"content"`
}

type SaveBlogContentResponse struct {
	Message string `json:"message"`
}

type UploadCoverRequest struct {
	BlogId string `json:"blog_id"`
	Image  string `json:"image" form:"image"`
}

type UploadCoverResponse struct {
	Message string `json:"message"`
	Image   string `json:"image"`
}

type BlogResponse struct {
	ID     string   `json:"id"`
	Title  string   `json:"title"`
	Cover  string   `json:"cover"`
	TagIDs []string `json:"tagIds"`
}

type GetBlogsResponse struct {
	Message string         `json:"message"`
	Blogs   []BlogResponse `json:"blogs"`
}

type GetBlogResponse struct {
	Message string      `json:"message"`
	Blog    models.Blog `json:"blog"`
}

type TagsRequestPayload struct {
	TagIDs []string `json:"tag_ids"`
}
