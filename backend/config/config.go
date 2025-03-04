package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
    "github.com/dotenv-org/godotenvvault"
)

var GoogleOauthConfig *oauth2.Config

func LoadConfig() error {
	err := godotenvvault.Load()
	if err != nil {
		return fmt.Errorf("error loading .env file: %w", err)
	}

	env := os.Getenv("APP_ENV")

	envFile := fmt.Sprintf(".env")
	if env != "" {
		envFile = fmt.Sprintf(".env.%s", env)
	}

	if err := godotenv.Load(envFile); err != nil {
		return fmt.Errorf("Error loading %s file: %w", envFile, err)
	}

	// Initialize Google OAuth Config
	GoogleOauthConfig = &oauth2.Config{
		ClientID:     Env("GOOGLE_CLIENT_ID"),
		ClientSecret: Env("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  Env("REDIRECT_URL"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
		Endpoint:     google.Endpoint,
	}

	return nil
}

func Env(key string, defaultValue ...string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}

	if len(defaultValue) > 0 {
		return defaultValue[0]
	}

	return ""
}
