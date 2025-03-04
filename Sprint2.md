# ZINE - Sprint 2

Zine is a digital journaling platform designed to offer users an intuitive and feature-rich journaling experience. The platform focuses on enhancing creativity, collaboration, and security, making it a versatile tool for maintaining personal records and sharing meaningful moments.

# Github Link

https://github.com/settivishal/Zine

## Video Links

Video Demo: [Demo Link](https://drive.google.com/file/d/1lhmBcRF8qusndiRR1nen4dKiXXxj3g11/view?usp=sharing)

## Authors

-  **Frontend** (Sravani Garapati, Shiva Kumar Thummanapalli)
-  **Backend** (Jaiharishan Arunagiri Veerakumar, Vishal Karthikeyan Setti)

## Sprint 2 - Objectives
Sprint 2 aims to implement routes for creating, deleting, updating, and retrieving tags, setting up Redis, configuring the AWS SDK, and setting up Vault for environment variables. Additionally, the "Forgot Password" API functionality will be developed. Unit tests will be written for each individual file in the package, and Swagger documentation will be updated accordingly.

On the frontend, the focus will be on developing the profile page and the calendar view page. Frontend and backend integration will be completed for both existing and new functionalities.

## Accomplishments
**Backend:**

- Tag Route APIs (Create, Delete, Set, Get)

- Forgot Password (Forgot password, Reset Password)
- Upload Image API (Profile Picture)

- REDIS Setup

- AWS SDK Setup (S3 and CloudF	ront)
- Logout endpoint bug fix

- Unit Tests
- Swagger Docs for API Endpoints

**Frontend:**

- Calendar Page
    - Month Grid
    - Week Grid
    - Navigation Buttons
- Profile Page
    - Bio
    - Profile Pic Update
    - Update Username
    - Change Password

- Yearly Activity grid in Profile Page


- Adding, Setting and Deleting Tags in Calendar page

- API endpoints Integration
    - Forgot Password
    - Profile Page Components
        - Change Password
        - Upload/Update Profile Picture
    - Create Tag
    - Set Tag
    - Delete Tag
    - Remove Tag
    - Get all Tags

## Unit Tests for Backend

Unit tests are written for each controller to ensure API functionality.

### Controllers with Unit Tests

| **Controllers**                  | **Test File**                          | **Purpose** |
|---------------------------------|--------------------------------|-----------|
| `auth_controller.go`            | `auth_controller_test.go`            | Tests authentication APIs (login, registration, JWT validation). |
| `social_controller.go`          | `social_controller_test.go`          | Tests social login and related features. |
| `swagger_controller.go`         | `swagger_controller_test.go`         | Verifies Swagger API documentation endpoints. |
| `tags_controller.go`            | `tags_controller_test.go`            | Tests CRUD operations for tags. |
| `user_controller.go`            | `user_controller_test.go`            | Tests user-related operations (profile update, deletion, etc.). |

### Services with Unit Tests

| **Services**                  | **Test File**                          | **Purpose** |
|---------------------------------|--------------------------------|-----------|
| `auth_service.go`            | `auth_service_test.go`            | Tests authentication APIs (login, registration, JWT validation). |
| `social_service.go`          | `social_service_test.go`          | Tests social login functionality and integration with third-party providers. |
| `mailing_service.go`         | `mailing_service_test.go`         | Tests email-related features, including sending and receiving emails. |
| `tags_service.go`            | `tags_service_test.go`            | Tests CRUD operations for managing tags. |
| `user_service.go`            | `user_service_test.go`            | Tests user-related operations, including profile updates, deletion, and management. |

### Middleware with Unit Tests

| **Middleware**                  | **Test File**                          | **Purpose** |
|---------------------------------|--------------------------------|-----------|
| `auth_middleware.go`            | `auth_middleware_test.go`               | Tests authentication middleware, including JWT validation and user authorization. |
| `headers_middleware.go`         | `headers_middleware_test.go`            | Tests the handling and validation of HTTP headers for requests and responses. |

### Utils with Unit Tests

| **Utils**                  | **Test File**                          | **Purpose** |
|---------------------------------|--------------------------------|-----------|
| `hash_utils.go`            | `hash_utils_test.go`             | Tests utility functions for hashing passwords and other sensitive data. |
| `jwt_utils.go`             | `jwt_utils_test.go`              | Tests utility functions for generating, validating, and parsing JWT tokens. |
| `response_utils.go`        | `response_utils_test.go`         | Tests utility functions for handling and formatting HTTP responses. |
| `token_utils.go`        | `token_utils_test.go`               | Tests utility functions for generating reset token. |

## Test for Frontend

### Cypress

1.  **Landing Page**
        - Checks for the display of the landing page with logo and buttons.
        - Checks for the navigations points of all the buttons.

2.  **Sign in**
        - Checks if Sign in button on Landing Page opens the AuthModal for the Sign in and Sign up tabs.
        - Verifies that the Sign In tab in the Modal is active by default, once opened.
        - Verifies that the Sign In form fields are visible.
        - Sends Mock API request for successful login.
        - Verifies redirection to profile page upon succesful Login.
        - Verifies that the auth tokens are stored in localStorage.
        - Verifies that an error message is displayed upon submission of invalid login creds.

3. **Sign up**
        - Verifies that the Sign Up form in the Modal is visible upon clicking the Sign up tab.
        - Verifies all the form entries are visible.
        - Verifies that the Sign Up button is visible.
        - Checks whether an error is thrown upon submitting empty fields.
        - Checks whether an error is thrown when the Password and Confirm Password don't match.
        - Verifies redirection to profile page upon Signing up.

4. **Modal**
        - Verifies the Modal shows both the Sign in and Sign up tabs.
        - Verifies the Modal Closes successfully upon clicking the "close button".
    
### Unit Tests


1. **ActivityGrid**
        - processes activity data and creates month grids

2. **Bio**
        - renders current bio when not editing
        - switches to edit mode when Edit button is clicked
        - cancels editing and reverts to original bio
        - does not submit if bio is unchanged
        - submits new bio when Save is clicked

3. **Navbar**
        - renders the ProfileDropdown component

4. **ProfileDropDown**
        - renders the ProfileDropdown component
        - renders the profile image
        - toggles dropdown menu on click
        - renders all dropdown options
        - closes dropdown after clicking an option
        - navigates to profile page when Profile option is clicked

5. **ProfilePic**
        - renders the profile picture if currentPicture is provided

6. **Tags**
        - renders the component with initial state
        - shows input fields when "Create New Tag" is clicked
        - hides input fields when "Cancel" is clicked
        - fetches tags when JWT token is available

7. **UpdatePassword**
        - shows error message if current password is not provided
        - shows error message if new password is not provided

8. **UpdateUsername**
        - shows input fields when "Edit" button is clicked
        - hides input fields when "Cancel" button is clicked
        - shows error message if username is empty
        - does not call onUpdate if username is unchanged
        - renders the component with the current username

## API Documentation

### Postman Collection
-  [Postman Collection](https://documenter.getpostman.com/view/41716151/2sAYX9oLg2)

### Authentication & Authorization
-   The APs use JWT-based authentication.
    
-   Protected routes require an `Authorization: Bearer <token>` header.
    
-   Users must be authenticated to create, update, set or delete tags.

### API Endpoints
1. **Login**
    - Endpoint: `POST /consumer/login`

    - Request Body:
    ```json
    {
        "Email": "dummy@gmail.com",
        "Password": "Password"
    }
    ```

    - Response:
    ```json
    {
        "message": "Authentication successful",
        "name": "Dummy",
        "email": "dummy@gmail.com",
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImR1bW15QGdtYWlsLmNvbSIsInN1YiI6ImFjY2Vzc190b2tlbiIsImV4cCI6MTc0MTA1MTg1NX0.u6znDU29aWwWMTsjxxOaEFBSobum4NyDu1WlLpRfxOc",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImR1bW15QGdtYWlsLmNvbSIsInN1YiI6InJlZnJlc2hfdG9rZW4iLCJleHAiOjE3NDE2NTYzNTV9.6r1LBEdNcMPM3o8fTrxNs13mfz7_Av7YV6szc2TRRRw",
        "expires_at": "2025-03-03T20:30:55.2793252-05:00"
    }
    ```

2. **Register**
    - Endpoint: `POST /consumer/register`

    - Request Body:
    ```json
    {
        "Name": "Dummy",
        "Password": "Password",
        "Email": "dummy@gmail.com"
    }
    ```

    - Response:
    ```json
    {
        "message": "Registration successful",
        "email": "dummy@gmail.com",
        "name": "Dummy"
    }
    ```

3. **Logout**
    - Endpoint: `POST /consumer/register`
    - Headers: `Authorization: Bearer <token>`
    - Repsone:
    ```json
    {
        "message": "Logout successful"
    }
    ```

4.  **Forgot Password**

    - Endpoint: `POST /consumer/forgot_password`

    - Headers: `Authorization: Bearer <token>`

    - Request Body:

    ```json
    {
        "email"  :  "dummy@gmail.com"
    }
    ```

    - Reponse:
    ```json
    {
        "message": "A password reset link has been sent"
    }
    ```

5.  **Reset Password**
    - Endpoint: `POST /consumer/reset_password`

    - Headers: `Authorization: Bearer <token>`

    - Request Body:

    ```json
    {
        "token" : "0b661899759f949ec9c6de71e54e97569a28e0158ca57477911cd89387628735",
        "password" : "Password1"
    }
    ```

    Reponse:
    ```json
    {
        "message": "Password has been reset successfully"
    }
    ```

6. **Google**
    - Endpoint: `GET /auth/google`

    - Response:
    ```json
    {
        "auth_url": "https://accounts.google.com/o/oauth2/auth?client_id=377234163527-vvjh1763shbli0m4rhnqtok95cq54j29.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fgoogle%2Fcallback&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&state=DEdsfmLXalUmU3z8rkfvoA%3D%3D"
    }
    ```

7. **Google callback**
    - Endpoint: `GET /auth/google/callback`

    - Params: `state: randomstate`
    - Params: `cpde: 4%2F0ASVgi3K1Vv36W7n8crHunNcE-v_5wCGDwcaVbN_CVNy8Rf6_yRmBrgzR_xBAj5Q2PznjoQ `
    - Params: `scope: email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email`
    - Params: `prompt: consent`

    - Response:
    ```json
    {
        "message": "Registration successful",
        "name": "Vishal K Setti",
        "email": "vishalsetti2000@gmail.com",
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpc2hhbHNldHRpMjAwMEBnbWFpbC5jb20iLCJzdWIiOiJhY2Nlc3NfdG9rZW4iLCJleHAiOjE3NDEwNTIzNjV9.MEwx0fTF-AGhOHHUfas4uQs1M9p3IKBMB1DTm_9u4ww",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpc2hhbHNldHRpMjAwMEBnbWFpbC5jb20iLCJzdWIiOiJyZWZyZXNoX3Rva2VuIiwiZXhwIjoxNzQxNjU2ODY1fQ.eszb_B24Q-_hRAlR8fx6eWjN9m4p083_RRU5Asb1UyQ",
        "expires_at": "2025-03-03T20:39:25.4064544-05:00"
    }
    ```

8. **Profile**
    - Endpoint: `GET /api/profile`

    - Headers: `Authorization: Bearer <token>`

    - Response:
    ```json
    {
        "message": "Welcome, Dummy",
        "email": "dummy@gmail.com",
        "name": "Dummy",
        "image": "https://d9amksc9hkkpj.cloudfront.net/7931917.jpg",
        "bio": "Welcome to my journal"
    }
    ```

9. **Change password**
    - Endpoint: `POST /api/change_password`

    - Headers: `Authorization: Bearer <token>`

    - Request Body:
    ```json
    {
        "Email": "vishalsetti@gmail.com",
        "Password": "Password2",
        "New_Password": "Password3"
    }
    ```

10. **Upload Profile**
    - Endpoint: `POST /api/image/update`

    - Headers: `Authorization: Bearer <token>`

    - Request Body (Multipart Form-Data):
        - image (file) – The image file to be uploaded.

    - Response:
    ```json
    {
        "message": "Image updated successfully",
        "image": "https://d9amksc9hkkpj.cloudfront.net/7931917.jpg"
    }
    ```


11. **Create Tag**
	- Endpoint: `POST /api/tag/create`
	- Headers: `Authorization: Bearer <token>`
	- Request Body:
	```json
	    {
	        "text":  "holiday1",
	        "color":  "#ffffff"
	    }
	```

    - Response:
    ```json
    {
        "message": "Tag created successfully"
    }
    ```

12. **Delete Tag**
    - Endpoint: `POST /api/tag/delete`
    
    - Headers: `Authorization: Bearer <token>`
    
    - Request Body:
      ```json
      {
	  "text": "holiday1"
      }
      ```
    - Response:
      ```json
      {
	  "message": "Tag deleted successfully"
      }
      ```

13.  **Set Tag**
	    - Endpoint: `POST /api/tag/set`
	
	    - Headers: `Authorization: Bearer <token>`
	
	    - Request Body:

	    ```json
            {
			"text":  "holiday1",
			"date":  "12/11/2025"
		    }
	    ```

	    - Response:
	    ```json
	    {
	        "message": "Tag set successfully"
	    }
	    ```

14.  **Remove Tag**
	    - Endpoint: `POST /api/tag/remove`
	
	    - Headers: `Authorization: Bearer <token>`
	
	    - Request Body:
	
	    ```json
	    {
	        "text":  "holiday",
	        "date":  "9/11/2025"
	    }
	    ```
	
	    - Response:
	    ```json
	    {
	        "message": "Tag removed successfully"
	    }
	    ```

15.  **Get Tag**
	    - Endpoint: `GET /api/tags`
	
	    - Headers: `Authorization: Bearer <token>`
	
	    - Response:
	    ```json
	    [
	        {
	            "ID": "67c65b6089cb4d6119d137e9",
	            "user_id": "",
	            "text": "holiday1",
	            "color": "#ffffff",
	            "dates": [
	                "12/11/2025"
	            ]
	        }
	    ]
	    ```