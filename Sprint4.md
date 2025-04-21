# ZINE - Sprint 4

Zine is a digital journaling platform designed to offer users an intuitive and feature-rich journaling experience. The platform focuses on enhancing creativity, collaboration, and security, making it a versatile tool for maintaining personal records and sharing meaningful moments.

# Github Link

https://github.com/settivishal/Zine

## Video Link

Video Demo: [Demo Link](https://drive.google.com/file/d/1wlqkZzrSATRPi1kTcLThvR0gw4-MJA9H/view?usp=sharing)

## Authors

-  **Frontend** (Sravani Garapati, Shiva Kumar Thummanapalli)
-  **Backend** (Jaiharishan Arunagiri Veerakumar, Vishal Karthikeyan Setti)

## Sprint 4 - Objectives


## Accomplishments

**Backend:**


**Frontend:**


## Unit Tests for Backend
| **Controllers**                  | **Test File**                          | **Purpose** |
|---------------------------------|--------------------------------|-----------|
| `auth_controller.go`            | `auth_controller_test.go`            | Tests authentication APIs (login, registration, JWT validation). |
| `social_controller.go`          | `social_controller_test.go`          | Tests social login and related features. |
| `swagger_controller.go`         | `swagger_controller_test.go`         | Verifies Swagger API documentation endpoints. |
| `tags_controller.go`            | `tags_controller_test.go`            | Tests CRUD operations for tags. |
| `user_controller.go`            | `user_controller_test.go`            | Tests user-related operations (profile update, deletion, etc.). |
| `blog_controller.go`            | `blog_controller_test.go`            | Tests blog-related operations (create blog, get blogs, get blogs by IDs, upload cover image). |
| `blog_controller.go`            | `blog_controller_test.go`            | Tests blog-related operations (create blog, get blogs, get blogs by IDs, upload cover image). |

### Services with Unit Tests

| **Services**                  | **Test File**                          | **Purpose** |
|---------------------------------|--------------------------------|-----------|
| `auth_service.go`            | `auth_service_test.go`            | Tests authentication APIs (login, registration, JWT validation). |
| `social_service.go`          | `social_service_test.go`          | Tests social login functionality and integration with third-party providers. |
| `mailing_service.go`         | `mailing_service_test.go`         | Tests email-related features, including sending and receiving emails. |
| `tags_service.go`            | `tags_service_test.go`            | Tests CRUD operations for managing tags. |
| `user_service.go`            | `user_service_test.go`            | Tests user-related operations, including profile updates, deletion, and management. |
| `blog_service.go`            | `blog_service_test.go`            | Tests blog-related operations. |

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

## Unit Tests and Cypress for Frontend
### Cypress


### Unit Tests


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
    - Endpoint: `POST /consumer/logout`
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

16.  **Get Tag by IDs**
	    - Endpoint: `POST /api/tags/getByIDs`
	
	    - Headers: `Authorization: Bearer <token>`

        - Request Body:
	
	    ```json
	    {
            "tag_ids": [
                "67e7884db0c4836677dc1e6e",
                "67e8531a759214d9d24c8697"
            ]
        }
	    ```
	
	    - Response:
	    ```
        [
            {
                "ID": "67e7884db0c4836677dc1e6e",
                "user_id": "",
                "text": "holiday1",
                "color": "#fff000",
                "dates": []
            },
            {
                "ID": "67e8531a759214d9d24c8697",
                "user_id": "",
                "text": "holiday",
                "color": "#fff000",
                "dates": null
            }
        ]
        ```

17.  **Get Blogs**
        - Endpoint: `GET /api/blogs?page=1&limit=7`

        - Headers: `Authorization: Bearer <token>`

        - Response:
        ```json
        {
            "message": "Blogs fetched successfully",
            "blogs": {
                "2025-03-23": {
                    "id": "67e84b8ad950e85ca14a8d7e",
                    "title": "",
                    "cover": "",
                    "tagIds": null
                },
                "2025-03-24": {
                    "id": "67e84b88d950e85ca14a8d7d",
                    "title": "",
                    "cover": "",
                    "tagIds": null
                },
            }
        }
        ```

18. **Get blog by ID**
	- Endpoint: `GET /api/blog/67e84b8ad950e85ca14a8d7e`
	
	- Headers: `Authorization: Bearer <token>`

    - Response:
    ```json
    {
        "message": "Blog fetched successfully",
        "blog": {
            "ID": "67e84b8ad950e85ca14a8d7e",
            "Title": "",
            "Cover": "",
            "Content": null,
            "Date": "2025-03-23",
            "UserID": "67e495f5c8fc3210a7c6a6bc",
            "TagIDs": null,
            "IsPublic": false,
            "Url": ""
        }
    }
    ```

19. **Create Blog Page**
	- Endpoint: `POST /api/blog/create`
	
	- Headers: `Authorization: Bearer <token>`

    - Request Body:

    ```json
    {
        "date": "2025-03-22"
    }
    ```

    - Response:
    ```json
    {
        "message": "Blog fetched successfully",
        "blog": {
            "ID": "67e84b8ad950e85ca14a8d7e",
            "Title": "",
            "Cover": "",
            "Content": null,
            "Date": "2025-03-23",
            "UserID": "67e495f5c8fc3210a7c6a6bc",
            "TagIDs": null,
            "IsPublic": false,
            "Url": ""
        }
    }
    ```

20. **Upload cover image**
    - Endpoint: `POST /api/blog/cover/upload`
	
	- Headers: `Authorization: Bearer <token>`

    - Request Body:

    ```json
    {
        "blog_id": "67e6cb055356881d20c0c48c",
        "image" : The image file to be uploaded.
    }
    ```

    - Response:
    ```json
    {
        "message": "Image uploaded successfully",
        "image": "https://d9amksc9hkkpj.cloudfront.net/WhatsApp Image 2025-03-28 at 10.48.55 AM.jpeg"
    }
    ```

21. **Get Grid**
    - Endpoint: `GET /api/profile/grid`
	
	- Headers: `Authorization: Bearer <token>`

    - Response:
    ```json
    {
        "message": "Grid fetched successfully",
        "grid": {
            "ID": "67e88c76f6fc273ba08294a8",
            "UserID": "67e495f5c8fc3210a7c6a6bc",
            "Dates": [
                "2025/2/20"
            ]
        }
    }
    ```

22. **Update Socials**
    - Endpoint: `POST /api/profile/update_socials`
	
	- Headers: `Authorization: Bearer <token>`

    - Request Body:

    ```json
    {
        "linkedin_url": "https://linkedin.com",
        "reddit_url": "https://reddit.com"
    }
    ```

    - Response:
    ```json
    {
        "message": "Socials updated successfully"
    }
    ```

23. **Update Hobbies**
    - Endpoint: `POST /api/profile/update_hobbies`
	
	- Headers: `Authorization: Bearer <token>`

    - Request Body:

    ```json
    {
        "hobbies": ["eating"]
    }
    ```

    - Response:
    ```json
    {
        "message": "Hobbies updated successfully"
    }
    ```

24. **Update Profile**
    - Endpoint: `POST /api/profile/update`
	
	- Headers: `Authorization: Bearer <token>`

    - Request Body:

    ```json
    {
        "age": 25
    }
    ```

    - Response:
    ```json
    {
        "message": "Profile updated successfully"
    }
    ```

25. **Get Blogs by Tag IDs**
    - Endpoint: `POST /api/blogs/getByTagIDs?page=1&limit=7`
	
	- Headers: `Authorization: Bearer <token>`

    - Request Body:

    ```json
    {
        "tag_ids": [
            "6803195b01ac6ec5b7270917",
            "68067e29c673363c6e9a09a8",
            "67e8531a759214d9d24c8697"
        ]
    }
    ```

    - Response:
    ```json
    {
        "message": "Blogs fetched successfully",
        "blogs": {
            "2025-03-23": {
                "id": "67e84b8ad950e85ca14a8d7e",
                "title": "",
                "cover": "",
                "tagIds": [
                    "68067e29c673363c6e9a09a8"
                ]
            },
            "2025-03-24": {
                "id": "67e84b88d950e85ca14a8d7d",
                "title": "",
                "cover": "",
                "tagIds": [
                    "67e7884db0c4836677dc1e6e",
                    "6803195b01ac6ec5b7270917",
                    "67e8531a759214d9d24c8697",
                    "68067e29c673363c6e9a09a8"
                ]
            }
        },
        "count": 2,
        "total_pages": 1
    }
    ```

26. **Get Blog by Date**
    - Endpoint: `GET /api/blog/date/2025-03-24`
	
	- Headers: `Authorization: Bearer <token>`

    - Response:
    ```json
    {
        "message": "Blog fetched successfully",
        "blog": {
            "id": "67e84b88d950e85ca14a8d7d",
            "title": "",
            "cover": "",
            "tagIds": [
                "67e7884db0c4836677dc1e6e",
                "6803195b01ac6ec5b7270917",
                "67e8531a759214d9d24c8697",
                "68067e29c673363c6e9a09a8"
            ]
        }
    }
    ```

27. **Delete cover image**
    - Endpoint: `POST /api/blog/cover/delete`
	
	- Headers: `Authorization: Bearer <token>`

    - Request Body:

    ```form-data
    blog_id: 67e84b82d950e85ca14a8d79
    ```

    - Response:
    ```json
    {
        "message": "Image deleted successfully"
    }
    ```

28. **Delete profile image**
    - Endpoint: `DELETE /api/image/delete`
	
	- Headers: `Authorization: Bearer <token>`

    - Response:
    ```json
    {
        "message": "Profile Image deleted successfully"
    }
    ``` 

29. **Change Visibility API**
    - Endpoint: `POST /api/blog/change-visibility`
	
	- Headers: `Authorization: Bearer <token>`

    - Request Body:

    ```json
    {
        "blog_id": "67e813a49f9de36ffe49beb7",
        "is_public": false,
        "users": ["jaiharishanav@gmail.com"]
    }
    ```

    - Response:
    ```json
    {
        "message": "Visibility changed successfully"
    }
    ```