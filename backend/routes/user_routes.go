package routes

import (
	"backend/controllers"

	"github.com/gorilla/mux"
)

func AuthRoutes(router *mux.Router) {
	userRouter := router.PathPrefix("/consumer").Subrouter()

	userRouter.HandleFunc("/login", controllers.Login).Methods("POST")
	userRouter.HandleFunc("/home", controllers.Home).Methods("GET")
	userRouter.HandleFunc("/refresh", controllers.Refresh).Methods("POST")
}
