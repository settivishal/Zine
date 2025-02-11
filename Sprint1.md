
# ZINE - Sprint 1

Zine is a digital journaling platform designed to offer users an intuitive and feature-rich journaling experience. The platform focuses on enhancing creativity, collaboration, and security, making it a versatile tool for maintaining personal records and sharing meaningful moments.

# Github Link
https://github.com/settivishal/Zine

## Video Links
Frontend: [Frontend](https://drive.google.com/file/d/1t1VNPy6ubwHZGHixCvYEYmIfcTXmNANy/view?usp=drive_link)

Backend: [Backend](https://drive.google.com/file/d/1qCbFb505Suz-3jVHbx2Gws1VCTuwUyOf/view?usp=drive_link)


## Authors

- **Frontend** (Sravani Garapati, Shiva Kumar Thummanapalli)

- **Backend** (Jaiharishan Arunagiri Veerakumar, Vishal Karthikeyan Setti)


## Sprint 1 - Objectives

Sprint 1 aims to implement authentication routes, set up the MongoDB database, configure email services, and integrate AWS S3 and CloudFront. Additionally, unit tests will be written, and Swagger documentation will be implemented for the API routes on the backend. On the frontend, the focus will be on developing the sign-in/sign-up functionality and designing a landing page. API integration with the backend, OAuth for Login and Sign up and structure the Landing Page for accommodating future content.




## Accomplishments

**Backend:**

- Authentication Routes (Register, Login, Logout, Change Password)
- Google OAuth Routes (Google Login, Callback)
- MongoDB Schema Design and Setup
- AWS S3 and CloudFront Setup
- SMTP Email Service
- Swagger Docs for API Endpoints
- Unit Tests

**Frontend:**

- Sign In / Sign Up Design and Integration
- Forgot Password UI Design
- Google OAuth Integration
- Landing Page UI Design



## Issues Resolved

The Issues stated below are created and resolved during the first sprint.

**Backend:**

- [Register and Login API](https://github.com/settivishal/Zine/issues/7) | User should be able to Register and Login into the application 
- [Google Social Login](https://github.com/settivishal/Zine/issues/9) | User should be able to do OAuth Sign In and Login into the application
- [Swagger Unit Test Setup](https://github.com/settivishal/Zine/issues/10) | I want to integrate Swagger for API documentation and set up unit testing for the project, So that I can ensure API clarity and maintain high code quality through automated testing.
- [Implement JWT Authentication](https://github.com/settivishal/Zine/issues/11) | Frontend will be able to securely communicate with the server through authorized API endpoints
- [MongoDB Setup](https://github.com/settivishal/Zine/issues/13) | Frontend should be able to send requests to the server via register and login and be able to store user information
- [Mailing Service Setup](https://github.com/settivishal/Zine/issues/24) | User should be able to receive information from the Zine application
- [Logout API](https://github.com/settivishal/Zine/issues/33) | User should be able to Logout of the application seamlessly 
- [Change Password API](https://github.com/settivishal/Zine/issues/34) | User should be able to Change the password in case of password leaking.
- [CORS Addition](https://github.com/settivishal/Zine/issues/56) | We want to enable CORS (Cross-Origin Resource Sharing) on the backend, So that the frontend can securely communicate with the backend API from a different origin.
- [MongoDB Schema](https://github.com/settivishal/Zine/issues/66) | Having Good Schema ensures that the application run effciently which ensures good user experience
- [AWS S3 Setup](https://github.com/settivishal/Zine/issues/67) | Setting up S3 so that users can be able to use the application easily and be able to expect fast response from the server
- [AWS CloudFront Setup](https://github.com/settivishal/Zine/issues/69) | User should be able to expect content availability across the globe
- [SMTP Email Implementation](https://github.com/settivishal/Zine/issues/76) | User should be able to get onboarding emails


**Frontend:**

- [Sign Up UI Design and Integration](https://github.com/settivishal/Zine/issues/47) | User should be able to create an account easily, so that the User can login and start using the platform without any hassle
- [Sign In UI Design and Integration](https://github.com/settivishal/Zine/issues/46) | User should be able to log into their account securely, So that the User can access their data and continue where they left off
- [Landing Page](https://github.com/settivishal/Zine/issues/45) | User should be able to see a well-designed landing page, So that the User can understand what the platform offers before signing up
- [Google OAuth Implementation](https://github.com/settivishal/Zine/issues/49) | User should be able to log in using their Google account, So that the User can access the platform quickly without creating a new password
- [Forgot Password UI Design](https://github.com/settivishal/Zine/issues/48) | User should be able to reset their password easily, So that the User can regain access to their account


## Issues Spillover to Sprint 2

**Backend:**

- [Redis Setup](https://github.com/settivishal/Zine/issues/17) - Redis is not implemented in Sprint 1 because only the authentication routes has been done and for only those routes Caching is not neccessary.

- [Forgot Password API](https://github.com/settivishal/Zine/issues/35) - To implement the Forgot Password feature, we initially required an email service that needed a custom domain. However, we later discovered an alternative method that allows us to set up the email service without needing our own domain.

**Frontend:**

- [Forgot Password](https://github.com/settivishal/Zine/issues/48) - The design for the Forgot Password feature is complete, but since the API is not yet implemented, we are unable to proceed. Additionally, mock data cannot be used for this specific endpoint.

## Additional Links

- [Database Schema](https://lucid.app/lucidchart/e7d4ab3c-0469-4278-86d0-c7a1d8b8dbe2/edit?beaconFlowId=DB4BBB3F7243FCE0&invitationId=inv_8599e167-59e6-4ed9-9773-5ab7c767a960&page=0_0#)

- [Postman Collection](https://documenter.getpostman.com/view/41716151/2sAYX9oLg2)