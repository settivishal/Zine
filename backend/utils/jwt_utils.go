package utils

import (
	"time"

	"backend/config"

	"github.com/golang-jwt/jwt/v5"
	"github.com/go-redis/redis/v8"
	"golang.org/x/net/context"
)

var jwtKey = []byte(config.Env("JWT_SECRET_KEY"))

// Redis client for token blacklist
var ctx = context.Background()
var redisClient = redis.NewClient(&redis.Options{
	Addr:     "redis-14344.c258.us-east-1-4.ec2.redns.redis-cloud.com:14344",
	Password: "QEitxbAHFjpdwgfmf3b6iaEYOkwxNzzN",
	DB:       0,
})

// GenerateJWT creates a new JWT token with custom expiration and subject
func GenerateJWT(email, subject string, expiry time.Duration) (string, time.Time, error) {
	expirationTime := time.Now().Add(expiry)
	claims := &Claims{
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			Subject:   subject,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	return tokenString, expirationTime, err
}

// ValidateJWT verifies a JWT token and extracts claims
func ValidateJWT(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, err
	}

	return claims, nil
}

// InvalidateJWT invalidates a JWT token by storing it in a blacklist
func InvalidateJWT(tokenString string) error {
	claims, err := ValidateJWT(tokenString)
	if err != nil {
		return err
	}

	// Store the token in Redis blacklist with expiration time
	expiration := claims.ExpiresAt.Time.Sub(time.Now())
	if expiration <= 0 {
		return nil // Token already expired
	}

	err = redisClient.Set(ctx, tokenString, "blacklisted", expiration).Err()
	if err != nil {
		return err
	}

	claims.ExpiresAt = jwt.NewNumericDate(time.Now())
	return nil
}
