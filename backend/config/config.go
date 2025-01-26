package config

import (
	"os"
)

type Config struct {
	Port string
}

var AppConfig Config

func LoadConfig() {
	AppConfig = Config{
		Port: getEnv("PORT", "8080"),
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
