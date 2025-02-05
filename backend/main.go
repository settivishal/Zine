package main

import (
	"log"
	"net/http"

	"backend/config"
	database "backend/db"
	"backend/routes"

	"github.com/gorilla/mux"
)

func main() {
	// Load configuration file
	if err := config.LoadConfig(); err != nil {
		log.Fatal("Failed to load config:", err)
	}

	// Connect to the MongoDB
	database.ConnectDB()
	defer database.DisconnectDB()

	// Initialize router
	router := mux.NewRouter()

	// Auth routes
	routes.Routes(router)

	// Swagger Routes
	routes.SwaggerRoutes(router)

	// Start the server
	port := config.Env("PORT", "8080")
	log.Println("Server running on port", port, "...")
	log.Println("Swagger UI available at http://localhost:" + port + "/swagger/index.html")
	log.Fatal(http.ListenAndServe(":"+port, router))
}
