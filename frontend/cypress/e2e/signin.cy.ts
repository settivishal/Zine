describe("Sign In Button Functionality", () => {
  beforeEach(() => {
    // Visit the landing page before each test
    cy.visit("http://localhost:3000/Landing"); // Replace with your actual URL
  });

  it("should open the Sign In modal when clicking the 'Sign in' button", () => {
    // Click the 'Sign in' button
    cy.contains("Sign in").click();

    // Verify that the Sign In tab is active by default
    cy.contains("Sign In").should(
      "have.class",
      "text-blue-500 border-b-2 border-blue-500 font-semibold"
    );

    // Verify that the Sign In form fields are visible
    cy.get("input[placeholder='Email']").should("be.visible");
    cy.get("input[placeholder='Password']").should("be.visible");
  });

  it("should successfully log in with valid credentials", () => {
    // Mock API request for successful login (optional)
    cy.intercept(
      "POST",
      "http://localhost:8080/consumer/login",
      { statusCode: 200, body: { access_token: "mockAccessToken", refresh_token: "mockRefreshToken" } }
    );

    // Open the modal by clicking 'Sign in'
    cy.contains("Sign in").click();

    // Fill out valid credentials and submit
    cy.get("input[placeholder='Email']").type("testuser@example.com");
    cy.get("input[placeholder='Password']").type("password123");
    cy.contains("Log in").click();

    // Verify redirection to profile page (mocked)
    cy.url().should("include", "/home");

    // Verify that tokens are stored in localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem("access_token")).to.eq("mockAccessToken");
      expect(win.localStorage.getItem("refresh_token")).to.eq("mockRefreshToken");
    });
  });


  it("should show an error when submitting invalid credentials", () => {
    // Open the modal by clicking 'Sign in'
    cy.contains("Sign in").click();

    // Fill out invalid credentials and submit
    cy.get("input[placeholder='Email']").type("invalid@example.com");
    cy.get("input[placeholder='Password']").type("wrongpassword");
    cy.contains("Log in").click();

    // Verify that an error message is displayed
    cy.get(".text-red-600").should(
      "contain.text",
      "user not found: invalid credentials" // This message comes from your backend response or error handling logic
    );
  });
  
});
