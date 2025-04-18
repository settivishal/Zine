package database

import (
	"context"
	"errors"
	"fmt"
	"math"
	"time"

	"backend/models"
	"backend/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// GetBlog
func GetBlog(BlogId string) (models.Blog, error) {
	collection := client.Database("zine").Collection("blogs")

	// Convert BlogId to MongoDB ObjectID
	objectID, err := primitive.ObjectIDFromHex(BlogId)
	if err != nil {
		return models.Blog{}, fmt.Errorf("invalid blog ID: %v", err)
	}

	// Find the blog by ID
	var blog models.Blog
	err = collection.FindOne(context.TODO(), bson.M{"_id": objectID}).Decode(&blog)

	if err == mongo.ErrNoDocuments {
		return models.Blog{}, errors.New("blog not found")
	}

	print(blog.ID, "Blog ID")

	return blog, err
}

// Create Blog
func CreateBlog(Email string, Request utils.CreateBlogRequest) (string, error) {
	collection := client.Database("zine").Collection("blogs")
	user, err := GetUser(Email)
	if err != nil {
		return "", err
	}

	// Validate and normalize the date
	parsedDate, err := time.Parse("2006-01-02", Request.Date)
	if err != nil {
		return "", errors.New("Error parsing date: " + Request.Date)
	}
	formattedDate := parsedDate.Format("2006-01-02")
	filter := bson.M{"user_id": user.ID, "date": formattedDate}
	existingBlog := models.Blog{}
	err = collection.FindOne(context.TODO(), filter).Decode(&existingBlog)
	if err == nil {
		return "", errors.New("A blog entry for this date already exists")
	} else if err != mongo.ErrNoDocuments {
		return "", err
	}

	// Create a new blog entry
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

func UploadCover(BlogId string, Cover string) error {
	collection := client.Database("zine").Collection("blogs")

	// Convert BlogId to MongoDB ObjectID
	objectID, err := primitive.ObjectIDFromHex(BlogId)
	if err != nil {
		return fmt.Errorf("invalid blog ID: %v", err)
	}
	filter := bson.M{"_id": objectID}
	update := bson.M{"$set": bson.M{"cover": Cover}}

	_, err = collection.UpdateOne(context.TODO(), filter, update)
	return err
}

// Get Blogs - Retrieve all blogs for a given user email
func GetBlogs(email string, page, limit int) ([]models.Blog, error, int, int) {
	collection := client.Database("zine").Collection("blogs")

	var blogs []models.Blog

	user, err := GetUser(email)
	if err != nil {
		return nil, errors.New("failed to retrieve user: " + err.Error()), 0, 0
	}
	userID := user.ID

	// Pagination calculations
	skip := (page - 1) * limit

	sort := bson.D{{Key: "date", Value: -1}}

	filter := bson.M{"user_id": userID}
	cursor, err := collection.Find(context.TODO(), filter, options.Find().SetLimit(int64(limit)).SetSkip(int64(skip)).SetSort(sort))
	if err != nil {
		return nil, err, 0, 0
	}
	defer cursor.Close(context.TODO())

	for cursor.Next(context.TODO()) {
		var blog models.Blog
		err := cursor.Decode(&blog)
		if err != nil {
			return nil, err, 0, 0
		}
		blogs = append(blogs, blog)
	}

	if err := cursor.Err(); err != nil {
		return nil, err, 0, 0
	}

	count, err := collection.CountDocuments(context.TODO(), filter)
	if err != nil {
		return nil, err, 0, 0
	}
	totalPages := int(math.Ceil(float64(count) / float64(limit)))

	return blogs, nil, int(count), totalPages
}

func GetBlogByDate(email, date string) (*models.Blog, error) {
	collection := client.Database("zine").Collection("blogs")

	user, err := GetUser(email)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve user: %v", err)
	}

	// Validate and normalize the date
	parsedDate, err := time.Parse("2006-01-02", date)
	if err != nil {
		return nil, errors.New("Error parsing date: " + date)
	}
	formattedDate := parsedDate.Format("2006-01-02")

	// Find the blog by user ID and date
	var blog models.Blog

	err = collection.FindOne(
		context.TODO(),
		bson.M{
			"user_id": user.ID,
			"date":    formattedDate,
		},
	).Decode(&blog)

	if err != nil {
        if err == mongo.ErrNoDocuments {
            return nil, nil // Return nil without error if no blog found
        }
        return nil, fmt.Errorf("database error: %v", err)
    }

	return &blog, nil
}
