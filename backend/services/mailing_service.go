package services

import (
	"fmt"
	"log"
	"net/smtp"

	"backend/config"
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

// SendPasswordResetEmail sends a password reset email
func SendPasswordResetEmail(email, name, resetURL string) error {
	from := config.Env("EMAIL_FROM")
	password := config.Env("EMAIL_PASSWORD")
	smtpHost := config.Env("SMTP_HOST")
	smtpPort := config.Env("SMTP_PORT")

	subject := "Password Reset Request"

	// Create email body
	body := fmt.Sprintf(`
	<html>
	<body>
		<h2>Hello %s,</h2>
		<p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
		<p>To reset your password, please click the link below:</p>
		<p><a href="%s">Reset Your Password</a></p>
		<p>This link will expire in 15 minutes.</p>
		<p>Thank you,<br>The Team</p>
	</body>
	</html>
	`, name, resetURL)

	// Construct message
	message := fmt.Sprintf("To: %s\r\n"+
		"Subject: %s\r\n"+
		"Content-Type: text/html; charset=UTF-8\r\n"+
		"\r\n"+
		"%s", email, subject, body)

	// Authentication
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// Send email
	return smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{email}, []byte(message))
}

func SendVisibilityChangeEmail(email string, blogID string, visibility bool) error {
	from := config.Env("EMAIL_FROM")
	password := config.Env("EMAIL_PASSWORD")
	smtpHost := config.Env("SMTP_HOST")
	smtpPort := config.Env("SMTP_PORT")

	subject := "[ZINE] Visibility Change Request"

	// Determine visibility status
	var visibilityStatus string
	if visibility {
		visibilityStatus = "public"
	} else {
		visibilityStatus = "protected"
	}

	// Create email body
	body := fmt.Sprintf(`
	<html>
	<body>
		<h2>Hello %s,</h2>
		<p>We received a request to change the visibility of a blog. If you didn't make this request, you can ignore this email.</p>
		<p>The blog visibility has been changed to %s.</p>
		<p>Thank you,<br>The Team</p>
	</body>
	</html>
	`, blogID, visibilityStatus)

	// Construct message
	message := fmt.Sprintf("To: %s\r\n"+
		"Subject: %s\r\n"+
		"Content-Type: text/html; charset=UTF-8\r\n"+
		"\r\n"+
		"%s", email, subject, body)

	// Authentication
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// Send email
	return smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{email}, []byte(message))
}
