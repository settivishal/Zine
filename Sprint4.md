# ZINE - Sprint 4

Zine is a digital journaling platform designed to offer users an intuitive and feature-rich journaling experience. The platform focuses on enhancing creativity, collaboration, and security, making it a versatile tool for maintaining personal records and sharing meaningful moments.

# Github Link

https://github.com/settivishal/Zine

## Video Link

Video Demo: [Demo Link]()

## Authors

-  **Frontend** (Sravani Garapati, Shiva Kumar Thummanapalli)
-  **Backend** (Jaiharishan Arunagiri Veerakumar, Vishal Karthikeyan Setti)

## Sprint 4 - Objectives
The Backend prioritizes the development of critical API routes to enhance both profile management and home page functionality, delivering improved user experience and content discoverability. Concurrently, we will implement comprehensive containerization of the backend system using Docker, establishing a standardized deployment process that ensures environment consistency across development, staging, and production. The infrastructure work will culminate in a production deployment, generating stable, versioned API endpoints with a dedicated production URL.

This sprint emphasizes the integration of backend APIs to significantly enhance user experience across core application interfaces, including the home page, blog management system, and profile pages. Additionally, we will implement comprehensive UI/UX enhancements, introducing a toggleable Light/Dark mode feature. On the infrastructure front, frontend components will undergo complete containerization using Docker, ensuring environment consistency and streamlined deployment workflows. The containerized application will be deployed to a production environment, generating a stable, versioned production URL.

**Frontend:**

The primary objective of Sprint 4 was to significantly enhance both the functionality and user experience of the blogging platform. This included fixing bugs from Sprint 3, improving visual consistency through a unified color palette, and introducing a toggle for light/dark themes. Key features such as a GitHub-style interactive activity grid, profile image and cover image management, and an advanced blog publishing system (with public/private access and selective email-based permissions) were implemented. Enhancements also included a calendar-integrated blog creation system for past dates, tag-based content filtering, and pagination for blog fetch and filter operations. To ensure a seamless collaborative experience, LiveBlocks was integrated for real-time synchronization. A robust testing pipeline was established using Jest and Cypress, while the frontend was containerized with Docker and deployed to production with versioned URLs.


## Accomplishments

**Backend:**
- Successfully implemented upload and delete routes for profile and blog cover images
- Added new endpoints for retrieving blogs with tag ID and date range filtering
- Introduced blog visibility controls for customizable sharing settings
- Containerized the backend using Docker for consistent deployment
- Deployed to production with a dedicated, versioned URL
- Achieved full unit test coverage for all new components
- Updated Swagger documentation for all API modifications
- Established production-ready infrastructure

**Frontend**
- Fixed bugs from Sprint3
- Implemented GitHub-style interactive profile grid for user activity tracking

- Integrated backend APIs:

- To upload and remove cover images in Blog pages
- Handled pagenation in front end for both fetch/bogs and filter/blogs responses 
- Fetching blogs for particular date using the calendar widget
- Ability to create blogs for the selected date in past
- Added tags and date functionality in Blog page
-  Enhanced UI by using a consistent colour palate  across all pages
- Added a toggle to switch between dark theme and light theme
- Gave the user to update their socials in profile page

- Blog publishing functionality

- Profile image management (upload/delete)

- Tag-based content filtering
- Users are able to publish their blog as public/ private (select email addresses that can access the blog)
- Users will be get mails regardign access changes on their blogs


- Added LiveBlocks integration for real-time content synchronization across blog pages

- Established comprehensive testing framework with:

- Jest unit tests

- Cypress end-to-end tests

- Containerized frontend application using Docker

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

#### added E2E tests for :
- Forgot Password page
- Reset password Page
- Updated Homepage and Profile Page tests
  
  

### Unit Tests

  #### Filter: 
   √  renders Filter button                                                
    √ opens popover when Filter button is clicked                          
    √ selects tags when clicked in popover                                 
    √ selects multiple tags                                         
    √ deselects tags when clicked again                                    
    √ shows active filter count on button                            
    √ shows Clear button when filters are active                     
    √ clears all filters when Clear button is clicked                
    √ clears selected tags in popover when Clear button inside popover is clicked                                                                               
    √ closes popover when Cancel button is clicked
    √ Apply button is disabled when no tags are selected               
    √ renders empty state when no tags are available

#### ActivityGrid

√ displays the correct number of active days
    √ renders month grids for the past 12 months
    √ renders active cells for dates in the activity data
    √ handles empty activity data gracefully
    √ handles API errors gracefully
    √ does not fetch data when no access token is available
    √ grid has the correct number of cells for each month

#### SignIn

√ renders signin form                                                 
    √ shows error when form is submitted with empty fields                  
    √ shows error for invalid email format
    √ submits the form successfully with valid credentials           
    √ handles API error response                                           
    √ handles network error during API call                                
    √ closes error message when X button is clicked                         
    √ updates email input when typed                                     
    √ updates password input when typed                                    
    √ navigates to forgot password page when link is clicked

#### SignUp

√ renders signup form                                                    
    √ shows error when form is submitted with empty fields                  
    √ shows error for invalid email format 
    √ shows error when passwords do not match                          
    √ submits the form successfully with valid data                         
    √ handles API error response                                        
    √ handles network error during API call                               
    √ closes error message when X button is clicked                        
    √ closes success message when X button is clicked

#### Publish Blog

√ renders the Publish Blog button                                      
    √ shows existing user emails when in private mode                   
    √ allows adding new email in private mode                            
    √ prevents adding duplicate email                                    
    √ prevents adding empty email)                                           
    √ submits with public visibility when in public mode                    
    √ submits with private visibility and new emails                       
    √ handles API error on submission                                     
    √ closes dialog when cancel button is clicked
#### Modal 

√ renders nothing when isOpen is false                              
    √ renders modal when isOpen is true                                    
    √ shows sign in tab by default                                     
    √ switches to sign up tab when clicked                           
    √ switches back to sign in tab when clicked                             
    √ calls onClose when close button is clicked                            
    √ shows success message after registration                               
    √ success message is not shown by default                                
    √ success message is not shown when switching tabs manually

#### Updated tests for BlogList, UpdateBio


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