package main

import (
	"log"
	"net/http"

	"backend/config"
	"backend/db"
	"backend/routes"

	"github.com/gorilla/mux"
)

func main() {
	// Load configuration
	config.LoadConfig()

	// Connect to the database
	db.ConnectDB()

	// Initialize router
	router := mux.NewRouter()

	// Register routes
	routes.RegisterUserRoutes(router)

	// Start the server
	port := config.AppConfig.Port
	log.Printf("Server running on port %s...", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
