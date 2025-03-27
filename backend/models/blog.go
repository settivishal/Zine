package models

// User struct represents a user document
type Blog struct {
	ID        string                 `bson:"_id,omitempty"`
	Title     string                 `bson:"title"`
	Thumbnail string                 `bson:"thumbnail"`
	Content   map[string]interface{} `bson:"block"` // Dynamic schema represented as a map
	Date      string                 `bson:"date"`  // THIS WILL BE UNIQUE FOR EACH BLOG
	UserID    string                 `bson:"user_id"`
	TagIDs    []string               `bson:"tag_ids"`
	IsPublic  bool                   `bson:"is_public"`
	Url       string                 `bson:"url"`
}
