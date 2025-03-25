package database

import (
	"context"
	"fmt"
	"reflect"
	"time"

	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"backend/models"
	"backend/utils"
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

// Update Profile updates a user's profile details
func UpdateProfile(Email string, Profile utils.UpdateProfileRequest) error {
	collection := client.Database("zine").Collection("users")

	filter := bson.M{"email": Email}

	// Check if the user exists
	var user models.User
	err := collection.FindOne(context.TODO(), filter).Decode(&user)
	if err != nil {
		return errors.New("user not found")
	}

	// fmt.Println(Profile.Name, Profile.Bio, Profile.Age, Profile.Gender)

	// update the profile fields only if they are not empty
	update := bson.M{"$set": bson.M{}}
	if Profile.Name != nil {
		update["$set"].(bson.M)["name"] = Profile.Name
	}
	if Profile.Bio != nil {
		update["$set"].(bson.M)["bio"] = Profile.Bio
	}
	if Profile.Age != nil {
		update["$set"].(bson.M)["age"] = Profile.Age
	}
	if Profile.Gender != nil {
		update["$set"].(bson.M)["gender"] = Profile.Gender
	}
	_, err = collection.UpdateOne(context.TODO(), filter, update)
	return err
}

func UpdateHobbies(Email string, Hobbies []string) error {
	collection := client.Database("zine").Collection("users")

	filter := bson.M{"email": Email}

	// Check if the user exists
	var user models.User
	err := collection.FindOne(context.TODO(), filter).Decode(&user)
	if err != nil {
		return errors.New("user not found")
	}

	// append to the hobbies array if they are null create one
	if user.Hobbies == nil {
		user.Hobbies = make([]string, 0)
	}
	user.Hobbies = append(user.Hobbies, Hobbies...)

	update := bson.M{"$set": bson.M{"hobbies": user.Hobbies}}
	_, err = collection.UpdateOne(context.TODO(), filter, update)
	return err
}

func UpdateSocials(Email string, Socials utils.UpdateProfileSocialsRequest) error {
	collection := client.Database("zine").Collection("users")

	filter := bson.M{"email": Email}

	// Check if the user exists
	var user models.User
	err := collection.FindOne(context.TODO(), filter).Decode(&user)
	if err != nil {
		return errors.New("user not found")
	}

	// check if the fields are non empty and then add to the document
	update := bson.M{"$set": bson.M{}}
	if Socials.InstagramUrl != nil {
		update["$set"].(bson.M)["instagram_url"] = Socials.InstagramUrl
	}
	if Socials.TwitterUrl != nil {
		update["$set"].(bson.M)["twitter_url"] = Socials.TwitterUrl
	}
	if Socials.LinkedinUrl != nil {
		update["$set"].(bson.M)["linkedin_url"] = Socials.LinkedinUrl
	}
	if Socials.RedditUrl != nil {
		update["$set"].(bson.M)["reddit_url"] = Socials.RedditUrl
	}
	_, err = collection.UpdateOne(context.TODO(), filter, update)
	return err
}
