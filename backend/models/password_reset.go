package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PasswordResetToken struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	UserID    string             `bson:"user_id"`
	Token     string             `bson:"token"`
	CreatedAt time.Time          `bson:"created_at"`
	ExpiresAt time.Time          `bson:"expires_at"`
	Used      bool               `bson:"used"`
}
