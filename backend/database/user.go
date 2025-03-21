package database

import (
	"context"
	"fmt"
	"reflect"
	"time"

	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"backend/models"
)

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

// UpdatePassword updates a user's password in MongoDB
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

func CreatePasswordResetToken(userID, token string) error {
	collection := client.Database("zine").Collection("password_reset_tokens")
	
	resetToken := models.PasswordResetToken{
		UserID:    userID,
		Token:     token,
		CreatedAt: time.Now(),
		ExpiresAt: time.Now().Add(15 * time.Minute),
		Used:      false,
	}
	
	_, err := collection.InsertOne(context.Background(), resetToken)
	return err
}

func GetValidToken(token string) (*models.PasswordResetToken, error) {
	collection := client.Database("zine").Collection("password_reset_tokens")
	
	var resetToken models.PasswordResetToken
	filter := bson.M{
		"token":      token,
		"expires_at": bson.M{"$gt": time.Now()},
		"used":       false,
	}
	
	err := collection.FindOne(context.Background(), filter).Decode(&resetToken)
	if err != nil {
		return nil, err
	}
	
	return &resetToken, nil
}

// MarkTokenAsUsed marks a token as used
func MarkTokenAsUsed(tokenID primitive.ObjectID) error {
	collection := client.Database("zine").Collection("password_reset_tokens")
	
	filter := bson.M{"_id": tokenID}
	update := bson.M{"$set": bson.M{"used": true}}
	
	_, err := collection.UpdateOne(context.Background(), filter, update)
	return err
}

// UpdateUserPassword updates a user's password
func UpdateUserPassword(userID, hashedPassword string) error {
	collection := client.Database("zine").Collection("users")

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return err
	}

	filter := bson.M{"_id": objID}
	update := bson.M{"$set": bson.M{"password": hashedPassword}}
	
	_, err = collection.UpdateOne(context.Background(), filter, update)
	return err
}
