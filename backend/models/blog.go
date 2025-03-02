package models

// User struct represents a user document
type Blog struct {
	ID       string   `bson:"_id,omitempty"`
	Title    string   `bson:"title"`
	Images   []string `bson:"images"`
	Audios   []string `bson:"audios"`
	Videos   []string `bson:"videos"`
	Links    []string `bson:"links"`
	Texts    []string `bson:"texts"`
	Date     string   `bson:"date"` // THIS WILL BE UNIQUE FOR EACH BLOG
	Order    []string `bson:"order"`
	UserID   string   `bson:"user_id"`
	TagIDs   []string `bson:"tag_ids"`
	IsPublic bool     `bson:"is_public"`
	Url      string   `bson:"url"`
}
