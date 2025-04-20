package models

// User struct represents a user document
type Blog struct {
	ID       string   `bson:"_id,omitempty"`
	Title    string   `bson:"title"`
	Cover    string   `bson:"cover"`
	Date     string   `bson:"date"` // THIS WILL BE UNIQUE FOR EACH BLOG
	UserID   string   `bson:"user_id"`
	TagIDs   []string `bson:"tag_ids"`
	IsPublic bool     `bson:"is_public"` // true if the blog is public, false if protected
	Url      string   `bson:"url"`
	Users    []string `bson:"users"` // List of user IDs who can view the blog
}
