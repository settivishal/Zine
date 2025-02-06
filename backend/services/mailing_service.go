package services

import (
	"fmt"

	"github.com/resend/resend-go/v2"

	"os"

	"log"

	"github.com/joho/godotenv"
)

func SendEmail(Email string) (*resend.SendEmailResponse, error) {

	// Load environment variables from.env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	apiKey := os.Getenv("RESEND_API_KEY")

	client := resend.NewClient(apiKey)

	log.Println("Sending email to", Email)

	params := &resend.SendEmailRequest{
		From:    "onboarding@resend.dev",
		To:      []string{Email},
		Subject: "Welcome to Zine!",
		Html:    "<h1> welcome to Zine! </h1>",
	}

	sent, err := client.Emails.Send(params)

	fmt.Println(sent)

	// sent is of type *resend.SendEmailResponse
	return sent, err
}
