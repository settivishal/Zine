package routes

import (
	"backend/controllers"

	"github.com/gorilla/mux"
)

func RegisterUserRoutes(router *mux.Router) {
	userRouter := router.PathPrefix("/users").Subrouter()
	userRouter.HandleFunc("/", controllers.GetUsers).Methods("GET")
}
