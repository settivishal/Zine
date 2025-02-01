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
	if err := config.LoadConfig(); err != nil {
		log.Fatal("Failed to load config:", err)
	}

	// Connect to the database
	db.ConnectDB()

	// Initialize router
	router := mux.NewRouter()

	// Auth routes
	routes.Routes(router)

	// Start the server
	port := config.Env("PORT", "8080")
	log.Printf("Server running on port %s...", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
