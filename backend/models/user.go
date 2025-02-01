package models

// User struct represents a user document
type User struct {
	Username string `bson:"username"`
	Password string `bson:"password"`
	Email    string `bson:"email"`
}
