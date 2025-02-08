package models

type Calender struct {
	UserID   string              `json:"user_id"`
	BlogDict map[string]string   `json:"blog_dict"`
	TagDict  map[string][]string `json:"tag_dict"`
}
