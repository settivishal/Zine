package models

type Tag struct {
	UserID string   `json:"user_id"`
	Text   string   `json:"text"`
	Color  string   `json:"color"`
	Dates  []string `json:"dates"`
}
