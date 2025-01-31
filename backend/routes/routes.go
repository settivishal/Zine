package routes

import (
	"backend/controllers"

	"github.com/gorilla/mux"
)

func AuthRoutes(router *mux.Router) {
	userRouter := router.PathPrefix("/consumer").Subrouter()

	userRouter.HandleFunc("/auth", controllers.Auth).Methods("POST")
}
