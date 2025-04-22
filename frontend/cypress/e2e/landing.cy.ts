describe("Landing Page", () => {
  beforeEach(() => {
    // Visit the landing page before each test
    cy.visit("http://localhost:3000/landing"); // Replace with your actual URL
  });

  it("should display the landing page with logo and buttons", () => {
    // Check if the logo is visible
    cy.get("img[alt='Zine']").should("be.visible");

    // Check if the 'Home' button is visible
    cy.contains("Home").should("be.visible");

    
  });
 
  it("should display the Homw ans signin buttons", () => {
    
    
    // Check if the 'Home' button is visible
    cy.contains("Home").should("be.visible");

    // Check if the 'Sign in' button is visible
    cy.contains("Sign in").should("be.visible");
  });
});
