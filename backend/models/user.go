package models

type User struct {
	Name  string `bson:"name"`
	Email string `bson:"email"`
	Age   int    `bson:"age"`
}
