package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gorilla/mux"
	// "github.com/rs/cors"
	httpSwagger "github.com/swaggo/http-swagger"
)

func Routes(router *mux.Router) {
	router.Use(middleware.JSONMiddleware)

	// Public Routes
	userRouter := router.PathPrefix("/consumer").Subrouter()

	userRouter.HandleFunc("/login", controllers.Login).Methods("POST")
	userRouter.HandleFunc("/register", controllers.Register).Methods("POST")
	userRouter.HandleFunc("/logout", controllers.Logout).Methods("POST")
	userRouter.HandleFunc("/forgot_password", controllers.ForgotPassword).Methods("POST")
	userRouter.HandleFunc("/reset_password", controllers.ResetPassword).Methods("POST")

	// Google
	authRouter := router.PathPrefix("/auth").Subrouter()
	authRouter.HandleFunc("/google", controllers.GoogleLogin).Methods("GET")
	authRouter.HandleFunc("/google/callback", controllers.GoogleCallback).Methods("GET")

	// Protected Routes
	api := router.PathPrefix("/api").Subrouter()
	api.Use(middleware.JWTAuthMiddleware)

	// User Routes
	api.HandleFunc("/profile", controllers.GetProfile).Methods("GET")
	api.HandleFunc("/change_password", controllers.ChangePassword).Methods("POST")
	api.HandleFunc("/image/update", controllers.UpdateImage).Methods("POST")
	api.HandleFunc("/profile/update", controllers.UpdateProfile).Methods("POST")
	api.HandleFunc("/profile/update_hobbies", controllers.UpdateHobbies).Methods("POST")
	api.HandleFunc("/profile/update_socials", controllers.UpdateSocials).Methods("POST")
	api.HandleFunc("/profile/grid", controllers.GetGrid).Methods("GET")

	// Tag Routes
	api.HandleFunc("/tag/create", controllers.CreateTag).Methods("POST")
	api.HandleFunc("/tag/delete", controllers.DeleteTag).Methods("POST")
	api.HandleFunc("/tag/set", controllers.SetTag).Methods("POST")
	api.HandleFunc("/tag/remove", controllers.RemoveTag).Methods("POST")
	api.HandleFunc("/tags", controllers.GetTags).Methods("GET")
	api.HandleFunc("/tags/getByIDs", controllers.GetTagsByIDs).Methods("POST")

	// Blog Routes
	api.HandleFunc("/blog/{_id}", controllers.GetBlog).Methods("GET")
	api.HandleFunc("/blog/create", controllers.CreateBlog).Methods("POST")
	api.HandleFunc("/blog/save", controllers.SaveBlog).Methods("POST")
	api.HandleFunc("/blog/cover/upload", controllers.UploadCover).Methods("POST")
	api.HandleFunc("/blog/date/{date}", controllers.GetBlogByDate).Methods("GET")
	api.HandleFunc("/blogs/getByTagIDs", controllers.GetBlogsByTagIDs).Methods("POST")
	api.HandleFunc("/blogs", controllers.GetBlogs).Methods("GET")
}

func SwaggerRoutes(router *mux.Router) {
	router.Use(middleware.JSONMiddleware)

	// Test route
	api := router.PathPrefix("/api/v1").Subrouter()
	api.HandleFunc("/hello", controllers.HelloHandler).Methods("GET")

	// Serve Swagger UI
	router.PathPrefix("/swagger/").Handler(httpSwagger.Handler(
		httpSwagger.URL("/api-docs"), // The URL pointing to API definition
	))

	// Serve OpenAPI specification
	router.HandleFunc("/api-docs", controllers.ServeSwaggerDocs)
}
