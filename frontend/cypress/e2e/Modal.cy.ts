describe("Sign In Modal Button Functionality", () => {
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

    // Close the modal
    cy.contains("❎").click();
    cy.should("not.exist");
  });


  it("should successfully close the modal when clicking ❎", () => {
    // Open the modal by clicking 'Sign in'
    cy.contains("Sign in").click();

    // Close the modal by clicking ❎
    cy.contains("❎").click();

    // Verify that the modal is no longer visible
    cy.should("not.exist");
  });
});
