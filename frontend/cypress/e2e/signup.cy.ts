describe("Sign Up Button Functionality", () => {
  beforeEach(() => {
    // Visit the landing page before each test
    cy.visit("http://localhost:3000/Landing"); // Replace with your actual URL
  });

  it("should open the Sign Up modal when clicking the 'Sign Up' button", () => {
    // Click the 'Sign in' button to open the modal
    cy.contains("Sign in").click();

    // Switch to the 'Sign Up' tab
    cy.contains("Sign Up").click();

    // Verify that the Sign Up form is visible
    cy.get("input[placeholder='Enter Username']").should("be.visible");
    cy.get("input[placeholder='Email']").should("be.visible");
    cy.get("input[placeholder='Password']").should("be.visible");
    cy.get("input[placeholder='Confirm Password']").should("be.visible");

    // Verify that the Sign Up button is visible
    cy.contains("Sign up").should("be.visible");
  });

  it("should show an error when submitting empty fields", () => {
    // Open the modal and switch to Sign Up tab
    cy.contains("Sign in").click();
    cy.contains("Sign Up").click();

    // Click the 'Sign up' button without filling any fields
    cy.contains("Sign up").click();

    // Verify that an error message is displayed
    cy.get(".text-red-600").should(
      "contain.text",
      "Please enter both email/username and password."
    );
  });

  it("should show an error when passwords do not match", () => {
    // Open the modal and switch to Sign Up tab
    cy.contains("Sign in").click();
    cy.contains("Sign Up").click();

    // Fill out valid username, email, and mismatched passwords
    cy.get("input[placeholder='Enter Username']").type("testuser");
    cy.get("input[placeholder='Email']").type("testuser@example.com");
    cy.get("input[placeholder='Password']").type("password123");
    cy.get("input[placeholder='Confirm Password']").type("password456");

    // Click the 'Sign up' button
    cy.contains("Sign up").click();

    // Verify that an error message is displayed for mismatched passwords
    cy.get(".text-red-600").should(
      "contain.text",
      "Password does not match!"
    );
  });

  it("should successfully sign up with valid inputs", () => {
    // Mock API request for successful signup (optional)
    cy.intercept(
      "POST",
      "http://localhost:8080/consumer/register",
      { statusCode: 200, body: { success: true } }
    );

    // Open the modal and switch to Sign Up tab
    cy.contains("Sign in").click();
    cy.contains("Sign Up").click();

    // Fill out valid username, email, and matching passwords
    cy.get("input[placeholder='Enter Username']").type("testuser");
    cy.get("input[placeholder='Email']").type("testuser@example.com");
    cy.get("input[placeholder='Password']").type("password123");
    cy.get("input[placeholder='Confirm Password']").type("password123");

    // Click the 'Sign up' button
    cy.contains("Sign up").click();

    // Verify redirection to profile page (mocked)
    cy.url().should("include", "/Profile");
  });
});
