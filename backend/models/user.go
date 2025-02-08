package models

// User struct represents a user document
type User struct {
	Password   string `bson:"password"`
	Email      string `bson:"email"`
	Name       string `bson:"name"`
	Picture    string `bson:"picture"`
	OauthToken string `bson:"token"`
}
