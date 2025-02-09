package main

import (
    "log"
    "net/http"

	"backend/config"
	database "backend/db"
	"backend/routes"

	"github.com/gorilla/mux"
	"github.com/rs/cors" // Added import for CORS
)

func main() {
    // Load configuration file
    if err := config.LoadConfig(); err != nil {
        log.Fatal("Failed to load config:", err)
    }

    // Connect to the MongoDB
    database.ConnectDB()
    defer database.DisconnectDB()

	// Initialize the router
	router := mux.NewRouter()

	// Register routes
	routes.Routes(router) // Using the existing Routes function

	// Set up CORS
	cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"}, // Allow access from localhost:3000
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})

	port := config.Env("PORT", "8080")
	log.Println("Server running on port", port, "...")
	log.Println("Swagger UI available at http://localhost:" + port + "/swagger/index.html")
	log.Fatal(http.ListenAndServe(":"+port, router))
}
