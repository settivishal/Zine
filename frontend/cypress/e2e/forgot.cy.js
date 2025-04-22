const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

describe('Forgot Password Page', () => {
    beforeEach(() => {
        // Visit the forgot password page with longer timeout
        cy.visit('http://localhost:3000/forgot', { timeout: 30000 });
    });

    it('should display the forgot password page correctly', () => {
        // Check for the logo
        cy.get('img[alt="Zine"]').should('be.visible');

        // Check for the title
        cy.contains('Trouble logging in?').should('be.visible');

        // Check for the description
        cy.contains('Enter your email, and we\'ll send you a reset link.').should('be.visible');

        // Check for the input field
        cy.get('input[type="email"]').should('be.visible');

        // Check for the send button
        cy.contains('Send Password Reset Link').should('be.visible');

        // Check for the back to login link
        cy.contains('Back to login').should('be.visible');
    });

    it('should validate the email field is required', () => {
        // Try to submit without entering email
        cy.contains('Send Password Reset Link').click();

        // Should show validation error message
        cy.contains('Please enter your email address.').should('be.visible');
    });

    it('should validate email format', () => {
        // Enter invalid email
        cy.get('input[type="email"]').type('invalid-email');

        // Submit form
        cy.contains('Send Password Reset Link').click();

        // Should show validation error message
        cy.contains('Please enter a valid email address.').should('be.visible');
    });



    it('should dismiss notification message when X is clicked', () => {
        // First trigger a validation error to get a message
        cy.contains('Send Password Reset Link').click();

        // Verify message is shown
        cy.contains('Please enter your email address.').should('be.visible');

        // Click the X button
        cy.contains('X').click();

        // Verify message is no longer visible
        cy.contains('Please enter your email address.').should('not.exist');
    });

    it('should navigate to login page when back to login is clicked', () => {
        // Click the back to login link
        cy.contains('Back to login').click();

        // Verify URL is correct
        cy.url().should('include', '/landing');
    });
});
