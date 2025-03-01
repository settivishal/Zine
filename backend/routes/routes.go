package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gorilla/mux"
	// "github.com/rs/cors"
	httpSwagger "github.com/swaggo/http-swagger"
)

func Routes(router *mux.Router) {
	router.Use(middleware.JSONMiddleware)

	// Public Routes
	userRouter := router.PathPrefix("/consumer").Subrouter()

	userRouter.HandleFunc("/login", controllers.Login).Methods("POST")
	userRouter.HandleFunc("/register", controllers.Register).Methods("POST")
	userRouter.HandleFunc("/logout", controllers.Logout).Methods("POST")

	// Google
	authRouter := router.PathPrefix("/auth").Subrouter()
	authRouter.HandleFunc("/google", controllers.GoogleLogin).Methods("GET")
	authRouter.HandleFunc("/google/callback", controllers.GoogleCallback).Methods("GET")

	// Protected Routes
	api := router.PathPrefix("/api").Subrouter()
	api.Use(middleware.JWTAuthMiddleware)
	api.HandleFunc("/profile", controllers.GetProfile).Methods("GET")
	api.HandleFunc("/change_password", controllers.ChangePassword).Methods("POST")
	api.HandleFunc("/tags", controllers.CreateTag).Methods("POST")
}

func SwaggerRoutes(router *mux.Router) {
	router.Use(middleware.JSONMiddleware)

	// Test route
	api := router.PathPrefix("/api/v1").Subrouter()
	api.HandleFunc("/hello", controllers.HelloHandler).Methods("GET")

	// Serve Swagger UI
	router.PathPrefix("/swagger/").Handler(httpSwagger.Handler(
		httpSwagger.URL("/api-docs"), // The URL pointing to API definition
	))

	// Serve OpenAPI specification
	router.HandleFunc("/api-docs", controllers.ServeSwaggerDocs)
}
