describe("Landing Page", () => {
  beforeEach(() => {
    // Visit the landing page before each test
    cy.visit("http://localhost:3000/Landing"); // Replace with your actual URL
  });

  it("should display the landing page with logo and buttons", () => {
    // Check if the logo is visible
    cy.get("img[alt='Zine']").should("be.visible");

    // Check if the 'Home' button is visible
    cy.contains("Home").should("be.visible");

    // Check if the 'Sign in' button is visible
    cy.contains("Sign in").should("be.visible");
  });

  
  it("should navigate to Home when clicking the 'Home' button", () => {
    // Click the 'Home' button
    cy.contains("Home").click();

    // Verify that it navigates to the home page (replace URL as needed)
    cy.url().should("eq", "http://localhost:3000/home");
  });
});
