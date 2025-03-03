package database

import (
	"context"
	"fmt"
	"log"
	"reflect"
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
func UserExists(email string) bool {
	collection := client.Database("zine").Collection("users")

	var result models.User
	filter := bson.M{"email": email}

	err := collection.FindOne(context.TODO(), filter).Decode(&result)
	return err == nil // If err is nil, the user exists
}

// GetUser retrieves a user from MongoDB by email
func GetUser(email string) (models.User, error) {
	collection := client.Database("zine").Collection("users")
	var user models.User
	filter := bson.M{"email": email}

	err := collection.FindOne(context.TODO(), filter).Decode(&user)
	if err == mongo.ErrNoDocuments {
		return models.User{}, errors.New("user not found")
	}
	return user, err
}

// UpsertUser updates an existing document or inserts a new one if it doesn't exist
func UpsertUser(collectionName string, filter bson.M, updateData models.User) error {
	collection := client.Database("zine").Collection(collectionName)

	// Convert updateData into a dynamic BSON document
	updateFields := bson.M{}
	val := reflect.ValueOf(updateData)

	if val.Kind() == reflect.Ptr {
		val = val.Elem()
	}
	if val.Kind() != reflect.Struct {
		return fmt.Errorf("updateData must be a struct")
	}

	typ := val.Type()
	for i := 0; i < val.NumField(); i++ {
		field := typ.Field(i)
		fieldValue := val.Field(i)

		// Skip zero values (prevents resetting fields)
		if !fieldValue.IsZero() {
			updateFields[field.Tag.Get("bson")] = fieldValue.Interface()
		}
	}

	// Construct the update document dynamically
	update := bson.M{"$set": updateFields}

	// Use UpdateOne with upsert enabled
	opts := options.Update().SetUpsert(true)
	_, err := collection.UpdateOne(context.TODO(), filter, update, opts)

	return err
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

func UpdatePassword(email string, hashedPassword string) error {
	collection := client.Database("zine").Collection("users")

	filter := bson.M{"email": email}
	update := bson.M{"$set": bson.M{"password": hashedPassword}}

	_, err := collection.UpdateOne(context.TODO(), filter, update)
	return err
}

// update image url in user
func UpdateImage(Email string, image string) error {
	collection := client.Database("zine").Collection("users")

	filter := bson.M{"email": Email}
	update := bson.M{"$set": bson.M{"image": image}}

	_, err := collection.UpdateOne(context.TODO(), filter, update)
	return err
}

// InsertTag saves a new tag in MongoDB
func InsertTag(Email string, Text string, Color string) error {
	collection := client.Database("zine").Collection("tags")

	var user models.User
	err := client.Database("zine").Collection("users").FindOne(context.TODO(), bson.M{"email": Email}).Decode(&user)
	if err != nil {
		return err
	}
	user_id := user.ID

	_, err = collection.InsertOne(context.TODO(), bson.M{"user_id": user_id, "text": Text, "color": Color})
	return err
}

// DeleteTag removes a tag from MongoDB
func DeleteTag(Email string, Text string) error {
	collection := client.Database("zine").Collection("tags")

	var user models.User
	err := client.Database("zine").Collection("users").FindOne(context.TODO(), bson.M{"email": Email}).Decode(&user)
	if err != nil {
		return err
	}
	user_id := user.ID

	// Check if the tag exists
	filter := bson.M{"text": Text, "user_id": user_id}
	var tag models.Tag
	if err := collection.FindOne(context.TODO(), filter).Decode(&tag); err != nil {
		return errors.New("tag not found")
	}

	_, err = collection.DeleteOne(context.TODO(), filter)

	return err
}

// Set tags in MongoDB
func SetTag(Email string, Text string, Date string) error {
	collection := client.Database("zine").Collection("tags")

	var user models.User
	err := client.Database("zine").Collection("users").FindOne(context.TODO(), bson.M{"email": Email}).Decode(&user)
	if err != nil {
		return err
	}
	user_id := user.ID

	// Check if the tag exists
	filter := bson.M{"text": Text, "user_id": user_id}
	var tag models.Tag
	if err := collection.FindOne(context.TODO(), filter).Decode(&tag); err != nil {
		return errors.New("tag not found")
	}

	// Add the date to the tag
	tag.Dates = append(tag.Dates, Date)

	// Update the tag in the database
	update := bson.M{"$set": bson.M{"dates": tag.Dates}}
	_, err = collection.UpdateOne(context.TODO(), filter, update)

	return err
}

// remove tag from a specific date
func RemoveTag(Email string, Text string, Date string) error {
	collection := client.Database("zine").Collection("tags")

	var user models.User
	err := client.Database("zine").Collection("users").FindOne(context.TODO(), bson.M{"email": Email}).Decode(&user)
	if err != nil {
		return err
	}
	user_id := user.ID

	// Check if the tag exists
	filter := bson.M{"text": Text, "user_id": user_id}
	var tag models.Tag
	if err := collection.FindOne(context.TODO(), filter).Decode(&tag); err != nil {
		return errors.New("tag not found")
	}

	// Remove the date from the tag
	for i, date := range tag.Dates {
		if date == Date {
			tag.Dates = append(tag.Dates[:i], tag.Dates[i+1:]...)
			break
		}
	}

	// Update the tag in the database
	update := bson.M{"$set": bson.M{"dates": tag.Dates}}
	_, err = collection.UpdateOne(context.TODO(), filter, update)

	return err
}

// GetTags retrieves all tags for a given user
func GetTags(Email string) ([]models.Tag, error) {
	collection := client.Database("zine").Collection("tags")

	var tags []models.Tag

	var user models.User
	err := client.Database("zine").Collection("users").FindOne(context.TODO(), bson.M{"email": Email}).Decode(&user)
	if err != nil {
		return nil, err
	}
	user_id := user.ID

	cursor, err := collection.Find(context.TODO(), bson.M{"user_id": user_id})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	for cursor.Next(context.TODO()) {
		var tag models.Tag
		err := cursor.Decode(&tag)
		if err != nil {
			return nil, err
		}
		tags = append(tags, tag)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return tags, nil
}
