package models

type Tag struct {
	ID     string   `bson:"_id,omitempty"`
	UserID string   `json:"user_id"`
	Text   string   `json:"text"`
	Color  string   `json:"color"`
	Dates  []string `json:"dates"`
}
