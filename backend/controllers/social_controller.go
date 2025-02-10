// package controllers

// import (
// 	"encoding/json"
// 	"net/http"

// 	"backend/utils"
// 	"backend/services"
// )

// // GoogleLogin redirects user to Google OAuth2 Login page

// // @Summary Google Login
// // @Description Google login function returns redirect url
// // @Tags users
// // @Produce json
// // @Success 200 
// // @Router /auth/google [GET]
// func GoogleLogin(w http.ResponseWriter, r *http.Request) {
// 	url, err := services.GetGoogleAuthURL()

// 	if err != nil {
// 		utils.SendErrorResponse(w, "Encryption error", err, http.StatusInternalServerError)
// 		return
// 	}

// 	json.NewEncoder(w).Encode(map[string]string{
// 		"auth_url": url,
// 	})
// }

// // GoogleCallback handles the callback from Google OAuth2
// func GoogleCallback(w http.ResponseWriter, r *http.Request) {
// 	response, err := services.HandleGoogleCallback(w, r)
// 	if err != nil {
// 		utils.SendErrorResponse(w, "Google authentication failed", err, http.StatusInternalServerError)
// 		return
// 	}

// 	utils.SendJSONResponse(w, response, http.StatusOK)
// }


package controllers

import (
    "encoding/json"
    //"log" // Importing the log package
    "net/http"
    "os"

    "golang.org/x/oauth2"
    "golang.org/x/oauth2/google"
)

var googleOauthConfig = &oauth2.Config{
    RedirectURL:  "http://localhost:8080/auth/google/callback",
    ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
    ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
    Scopes:       []string{"https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"},
    Endpoint:     google.Endpoint,
}

func GoogleLogin(w http.ResponseWriter, r *http.Request) {
    // Log the client ID and client secret to verify they are set correctly
    //log.Println("Client ID:", googleOauthConfig.ClientID)
    //log.Println("Client Secret:", googleOauthConfig.ClientSecret)

    url := googleOauthConfig.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
    json.NewEncoder(w).Encode(map[string]string{"auth_url": url})
}

func GoogleCallback(w http.ResponseWriter, r *http.Request) {
    code := r.URL.Query().Get("code")
    token, err := googleOauthConfig.Exchange(oauth2.NoContext, code)
    if err != nil {
        http.Error(w, "Failed to exchange token: "+err.Error(), http.StatusInternalServerError)
        return
    }

    // Use the token to get user info or store it in the session
    // For example, you can store the token in a cookie or session
    http.SetCookie(w, &http.Cookie{
        Name:     "access_token",
        Value:    token.AccessToken,
        Expires:  token.Expiry,
        HttpOnly: true,
    })

    // Redirect to the profile page or another page
    http.Redirect(w, r, "http://localhost:3000/profile", http.StatusSeeOther)
}