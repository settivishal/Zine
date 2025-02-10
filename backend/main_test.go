package main_test

import (
	"log"
	"os"
	"testing"

	"github.com/joho/godotenv"
)

func TestMain(m *testing.M) {
	// Load environment variables from .env.test
	if err := godotenv.Load(".env.test"); err != nil {
		log.Fatalf("Error loading .env.test file: %v", err)
	}

	// Run all tests
	exitCode := m.Run()

	// Exit with the test result
	os.Exit(exitCode)
}
