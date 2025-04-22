const PROFILE_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Configure longer timeout for profile tests
const profileRequestTimeout = 10000;

// Mock token to use consistently across profile tests
const PROFILE_FAKE_TOKEN = 'fake-test-token';

describe('Profile Page Tests', { defaultCommandTimeout: 20000 }, () => {
  beforeEach(() => {
    // Set future expiration date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); // Set to tomorrow
    const expiresAt = futureDate.toISOString();

    // Mock with fake token for all tests
    cy.setCookie('accessToken', PROFILE_FAKE_TOKEN);
    cy.setCookie('expires_at', expiresAt);

    // Mock API responses for authenticated endpoints
    cy.intercept('GET', `${PROFILE_API_BASE_URL}/users/profile`, {
      statusCode: 200,
      body: {
        name: 'Test User',
        email: 'test@example.com',
        age: 30,
        gender: 'Other',
        hobbies: ['Reading', 'Coding'],
        profilePicture: 'https://via.placeholder.com/150'
      }
    }).as('getUserProfile');

    cy.intercept('GET', `${PROFILE_API_BASE_URL}/posts/activity/*`, {
      statusCode: 200,
      body: [] // Empty array or mock activity data as needed
    }).as('getUserActivity');

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

  // Test core functionality - page load
  it('should load the profile page successfully', () => {
    // Simple test to verify basic page structure is loaded
    cy.get('nav', { timeout: 10000 }).should('exist');

    // Check for the main profile container
    cy.get('.bg-orange-100', { timeout: 15000 }).should('be.visible');
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