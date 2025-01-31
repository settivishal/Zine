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

	// Protected Routes
	api := router.PathPrefix("/api").Subrouter()
	api.Use(middleware.JWTAuthMiddleware)
	userRouter.HandleFunc("/profile", controllers.GetProfile).Methods("GET")
}
