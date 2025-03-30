package models

type Grid struct {
	ID     string   `bson:"_id,omitempty"`
	UserID string   `bson:"user_id"`
	Dates  []string `bson:"dates"`
}
