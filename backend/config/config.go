package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
    "github.com/dotenv-org/godotenvvault"
	"github.com/go-redis/redis/v8"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var GoogleOauthConfig *oauth2.Config
var RedisClient *redis.Client

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

	RedisClient = redis.NewClient(&redis.Options{
		Addr:     Env("REDIS_URL_NEW"),
		Password: Env("REDIS_PASSWORD"),
		DB:       0,
	})

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
