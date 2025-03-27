package middleware

import (
	"context"
	"net/http"
	"strings"

	"backend/utils"

	"github.com/redis/go-redis/v9"
)

// Redis client for token blacklist
var ctx = context.Background()
var redisClient = redis.NewClient(&redis.Options{
	Addr:     "redis-14344.c258.us-east-1-4.ec2.redns.redis-cloud.com:14344",
	Password: "QEitxbAHFjpdwgfmf3b6iaEYOkwxNzzN",
	DB:       0,
})

func JWTAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			utils.SendResponse(w, "Missing token", http.StatusUnauthorized)
			return
		}

		token := strings.Split(authHeader, "Bearer ")
		if len(token) < 2 {
			utils.SendResponse(w, "Invalid token format", http.StatusUnauthorized)
			return
		}

		if IsTokenBlacklisted(token[1]) {
			utils.SendResponse(w, "User logged out", http.StatusUnauthorized)
			return
		}

		// Validate JWT token
		claims, err := utils.ValidateJWT(token[1])
		if err != nil {
			utils.SendResponse(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Attach user info to request context
		ctx := context.WithValue(r.Context(), "email", claims.Email)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// IsTokenBlacklisted checks if the provided token is blacklisted.
func IsTokenBlacklisted(tokenString string) bool {
	_, err := redisClient.Get(ctx, tokenString).Result()
	return err == nil // If found in Redis, it's blacklisted
}
