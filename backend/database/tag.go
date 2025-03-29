package database

import (
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"

	"backend/models"
	"slices"
)

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
	tagsCollection := client.Database("zine").Collection("tags")
	blogCollection := client.Database("zine").Collection("blogs")

	var user models.User
	err := client.Database("zine").Collection("users").FindOne(context.TODO(), bson.M{"email": Email}).Decode(&user)
	if err != nil {
		return err
	}
	user_id := user.ID

	// Check if the tag exists
	filter := bson.M{"text": Text, "user_id": user_id}
	var tag models.Tag
	if err := tagsCollection.FindOne(context.TODO(), filter).Decode(&tag); err != nil {
		return errors.New("tag not found")
	}

	if slices.Contains(tag.Dates, Date) {
		return nil
	}

	// Add the date to the tag
	tag.Dates = append(tag.Dates, Date)

	// Update the tag in the database
	update := bson.M{"$set": bson.M{"dates": tag.Dates}}
	_, err = tagsCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return err
	}

	// Update the blog with the tag
	var blog models.Blog

	// convert the date string to a time.Time object
	parsedDate, err := time.Parse("01/02/2006", Date)
	if err != nil {
		return err
	}
	normalizedDate := parsedDate.Format("1/2/2006")

	blogFilter := bson.M{"date": normalizedDate, "user_id": user_id}
	err = blogCollection.FindOne(context.TODO(), blogFilter).Decode(&blog)
	if err != nil {
		return errors.New("blog not found")
	}

	if slices.Contains(blog.TagIDs, tag.ID) {
		return nil
	}

	// Add the tag ID to the blog
	blog.TagIDs = append(blog.TagIDs, tag.ID)

	// Update the blog in the database
	updateBlog := bson.M{"$set": bson.M{"tag_ids": blog.TagIDs}}
	_, err = blogCollection.UpdateOne(context.TODO(), blogFilter, updateBlog)
	if err != nil {
		return err
	}

	return nil
}

// remove tag from a specific date
func RemoveTag(Email string, Text string, Date string) error {
	tagsCollection := client.Database("zine").Collection("tags")
	blogCollection := client.Database("zine").Collection("blogs")

	var user models.User
	err := client.Database("zine").Collection("users").FindOne(context.TODO(), bson.M{"email": Email}).Decode(&user)
	if err != nil {
		return err
	}
	user_id := user.ID

	// Check if the tag exists
	filter := bson.M{"text": Text, "user_id": user_id}
	var tag models.Tag
	if err := tagsCollection.FindOne(context.TODO(), filter).Decode(&tag); err != nil {
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
	_, err = tagsCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return err
	}

	// Update the blog by removing the tag ID
	var blog models.Blog

	// convert the date string to a time.Time object
	parsedDate, err := time.Parse("01/02/2006", Date)
	if err != nil {
		return err
	}
	normalizedDate := parsedDate.Format("1/2/2006")

	blogFilter := bson.M{"date": normalizedDate, "user_id": user_id}
	err = blogCollection.FindOne(context.TODO(), blogFilter).Decode(&blog)
	if err != nil {
		return errors.New("blog not found")
	}

	// Remove the tag ID from the blog's TagIDs array
	for i, tagID := range blog.TagIDs {
		if tagID == tag.ID {
			blog.TagIDs = slices.Delete(blog.TagIDs, i, i+1)
			break
		}
	}

	// Update the blog in the database
	updateBlog := bson.M{"$set": bson.M{"tag_ids": blog.TagIDs}}
	_, err = blogCollection.UpdateOne(context.TODO(), blogFilter, updateBlog)
	if err != nil {
		return err
	}

	return nil
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

// GetTagsByID retrieves all tags for a given user and date
func GetTagsByID(TagIDs []string) ([]models.Tag, error) {
	collection := client.Database("zine").Collection("tags")

	filter := bson.M{"_id": bson.M{"$in": TagIDs}}

	var tags []models.Tag
	cursor, err := collection.Find(context.TODO(), filter)
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
