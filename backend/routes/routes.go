package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gorilla/mux"
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
}
