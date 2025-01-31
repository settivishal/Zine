package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gorilla/mux"
)

func Routes(router *mux.Router) {
	userRouter := router.PathPrefix("/consumer").Subrouter()

	// Public Routes
	userRouter.HandleFunc("/login", controllers.Login).Methods("POST")
	userRouter.HandleFunc("/register", controllers.Register).Methods("POST")

	// Protected Routes
	api := router.PathPrefix("/api").Subrouter()
	api.Use(middleware.JWTAuthMiddleware)
	api.HandleFunc("/profile", controllers.GetProfile).Methods("GET")
}
