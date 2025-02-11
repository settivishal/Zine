package models

// User struct represents a user document
type User struct {
	Name       string `bson:"name"`
	Email      string `bson:"email"`
	Password   string `bson:"password"`
	Image      string `bson:"image"`
	OauthToken string `bson:"token"`
	Bio        string `bson:"bio"`
}
