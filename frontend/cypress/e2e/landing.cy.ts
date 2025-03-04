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

  // it("should open the Sign in modal when clicking the 'Sign in' button", () => {
  //   // Click the 'Sign in' button
  //   cy.contains("Sign in").click();

  //   // Check if the modal is visible
  //   cy.get("[role='dialog']").should("be.visible");

  //   // Close the modal
  //   cy.get("[role='dialog'] .close-button").click(); // Replace `.close-button` with your modal's close button selector
  //   cy.get("[role='dialog']").should("not.exist");
  // });

  it("should navigate to Home when clicking the 'Home' button", () => {
    // Click the 'Home' button
    cy.contains("Home").click();

    // Verify that it navigates to the home page (replace URL as needed)
    cy.url().should("eq", "http://localhost:3000/home");
  });
});
