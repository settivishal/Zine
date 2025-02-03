package middleware

import (
	"context"
	"net/http"
	"strings"

	"backend/utils"
)

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

		claims, err := utils.ValidateJWT(token[1])
		if err != nil {
			utils.SendResponse(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Attach user info to request context
		ctx := context.WithValue(r.Context(), "email", claims.Email)
		ctx = context.WithValue(ctx, "name", claims.Name) 
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
