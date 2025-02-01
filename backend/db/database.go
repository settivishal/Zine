package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"errors"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"backend/models"
)

var client *mongo.Client

// ConnectDB initializes and connects to MongoDB Atlas
func ConnectDB() *mongo.Client {

	// Load environment variables from.env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	uri := os.Getenv("MONGO_URI")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(uri)
	c, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("Error connecting to MongoDB Atlas:", err)
	}

	// Ensure connection is established
	err = c.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Could not connect to MongoDB Atlas:", err)
	}

	fmt.Println("Connected to MongoDB Atlas!")
	client = c
	return client
}

// InsertUser saves a new user in MongoDB
func InsertUser(user models.User) error {
	collection := client.Database("zine").Collection("users")

	_, err := collection.InsertOne(context.TODO(), user)
	return err
}

// UserExists checks if a user already exists in the database
func UserExists(username string) bool {
	collection := client.Database("zine").Collection("users")

	var result models.User
	filter := bson.M{"username": username}

	err := collection.FindOne(context.TODO(), filter).Decode(&result)
	return err == nil // If err is nil, the user exists
}

// GetUser retrieves a user from MongoDB by username
func GetUser(username string) (models.User, error) {
	collection := client.Database("zine").Collection("users")
	var user models.User
	filter := bson.M{"username": username}

	err := collection.FindOne(context.TODO(), filter).Decode(&user)
	if err == mongo.ErrNoDocuments {
		return models.User{}, errors.New("user not found")
	}
	return user, err
}

// DisconnectDB closes the database connection
func DisconnectDB() {
	if client != nil {
		err := client.Disconnect(context.TODO())
		if err != nil {
			log.Fatal("Error disconnecting from MongoDB Atlas:", err)
		}
		fmt.Println("Disconnected from MongoDB Atlas")
	}
}
