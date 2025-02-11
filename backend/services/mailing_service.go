package services

import (
	"fmt"

	"log"
	"net/smtp"
)

func SendMailSimple(subject string, html string, to []string) {
	auth := smtp.PlainAuth("", "zinejounral@gmail.com", "zlse aoxk pzil cnnq", "smtp.gmail.com")

	Headers := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";"

	msg := "Subject: " + subject + "\n" + Headers + "\n\n" + html

	err := smtp.SendMail("smtp.gmail.com:587", auth, "zinejounral@gmail.com", to, []byte(msg))

	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Println("Email sent successfully!")
	}
}
