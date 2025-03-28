package database

import (
	"context"
	"fmt"
	"time"

	"errors"

	"backend/models"
	"backend/utils"

	"go.mongodb.org/mongo-driver/bson"
)

// Create Blog
func CreateBlog(Email string, Request utils.CreateBlogRequest) (string, error) {
	collection := client.Database("zine").Collection("blogs")
	user, err := GetUser(Email)
	if err != nil {
		return "", err
	}
	blog := models.Blog{
		Date:     Request.Date,
		UserID:   user.ID,
		IsPublic: false,
	}
	new_blog, err := collection.InsertOne(context.TODO(), blog)

	blog_url := ""

	if oid, ok := new_blog.InsertedID.(interface{ Hex() string }); ok {
		blog_url = fmt.Sprintf("localhost:3000/blogs/%s", oid.Hex())
	} else {
		return "", errors.New("failed to retrieve the ID of the new blog")
	}

	return blog_url, err
}

// Save Blog Content in to blog document
func SaveBlogContent(Request utils.SaveBlogContentRequest) error {
	collection := client.Database("zine").Collection("blogs")

	filter := bson.M{"_id": Request.BlogId}
	update := bson.M{"$set": bson.M{"content": Request.Content}}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return fmt.Errorf("failed to update blog content: %v", err)
	}

	if result.MatchedCount == 0 {
		return errors.New("no blog found with the given blog_id")
	}

	return nil

}
