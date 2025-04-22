const PROFILE_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const PROFILE_REAL_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNoaXZhLnRodW1tYW5hcGFsbGlAZ21haWwuY29tIiwic3ViIjoiYWNjZXNzX3Rva2VuIiwiZXhwIjoxNzQ1ODg1NDA0fQ.nDLuZ5yXmgv2DBiX8RLnwbRop3a9z7yYoy0wG8LfQF8';

// Separate test group for navbar tests with fake token to prevent real token invalidation
describe('Profile Page Navbar Tests', () => {
  beforeEach(() => {
    // Set future expiration date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); // Set to tomorrow
    const expiresAt = futureDate.toISOString();

    // Mock with fake token for navbar tests
    cy.setCookie('accessToken', 'fake-token');
    cy.setCookie('expires_at', expiresAt);

    // Visit the profile page with longer timeout
    cy.visit('http://localhost:3000/profile', { timeout: 30000 });
  });

  // Test that we need to be authenticated to access profile
  it('should allow access to profile page when authenticated', () => {
    cy.url().should('include', '/profile');
  });

  // Test Navbar presence and functionality
  it('should display the navbar', () => {
    cy.get('nav', { timeout: 10000 }).should('exist');
    cy.get('img[alt="Logo"]', { timeout: 10000 }).should('be.visible');
  });
});

// Main test group with real token - setting longer default timeout
describe('Profile Page Functional Tests', { defaultCommandTimeout: 20000 }, () => {
  beforeEach(() => {
    // Set future expiration date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); // Set to tomorrow
    const expiresAt = futureDate.toISOString();

    // Use real token for all other tests
    cy.setCookie('accessToken', PROFILE_REAL_TOKEN);
    cy.setCookie('expires_at', expiresAt);

    // Visit the profile page with increased timeout
    cy.visit('http://localhost:3000/profile', { timeout: 30000 });
  });

  // Test core functionality - page load
  it('should load the profile page successfully', () => {
    // Simple test to verify basic page structure is loaded
    cy.get('nav', { timeout: 10000 }).should('exist');

    // Check for the main profile container
    cy.get('.bg-orange-100', { timeout: 15000 }).should('be.visible');
  });

  // Test profile picture component
  it('should display profile picture section', () => {
    // Look for profile picture component
    cy.get('.bg-orange-50', { timeout: 15000 })
      .find('img')
      .should('exist');
  });

  // Test Activity Grid
  it('should display activity grid', () => {
    cy.contains('Activity Grid', { timeout: 15000 }).should('be.visible');
    cy.contains('Your Activity', { timeout: 15000 }).should('be.visible');

    // Wait for grid to load
    cy.wait(2000);
  });

  // Test Age and Gender sections
  it('should display personal information sections', () => {
    // Check for age section
    cy.contains('Age:', { timeout: 15000 }).should('be.visible');

    // Check for gender section
    cy.contains('Gender:', { timeout: 15000 }).should('be.visible');

    // Check for hobbies section
    cy.contains('Hobbies:', { timeout: 15000 }).should('be.visible');
  });
});