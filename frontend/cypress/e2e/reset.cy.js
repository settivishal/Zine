const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

describe('Reset Password Page', () => {
    const mockToken = 'mock-reset-token-123';

    beforeEach(() => {
        // Visit the reset password page with a mock token
        cy.visit(`http://localhost:3000/reset-password?token=${mockToken}`, { timeout: 30000 });
    });

    it('should display the reset password page correctly', () => {
        // Check for the logo
        cy.get('img[alt="Zine"]').should('be.visible');

        // Check for the title
        cy.contains('Reset Your Password').should('be.visible');

        // Check for the description
        cy.contains('Enter your new password below.').should('be.visible');

        // Check for password input fields
        cy.get('input[type="password"]').should('have.length', 2);

        // Check for the reset button
        cy.contains('Reset Password').should('be.visible');

        // Check for the back to login link
        cy.contains('Back to login').should('be.visible');
    });

    it('should validate both password fields are required', () => {
        // Try to submit without entering passwords
        cy.contains('Reset Password').click();

        // Should show validation error message
        cy.contains('Please enter both password fields').should('be.visible');
    });

    it('should validate passwords match', () => {
        // Enter different passwords
        cy.get('input[type="password"]').first().type('password123');
        cy.get('input[type="password"]').last().type('differentpassword');

        // Submit form
        cy.contains('Reset Password').click();

        // Should show validation error message
        cy.contains('Passwords do not match').should('be.visible');
    });

    it('should dismiss error message when X is clicked', () => {
        // First trigger a validation error to get a message
        cy.contains('Reset Password').click();

        // Verify error message is shown
        cy.contains('Please enter both password fields').should('be.visible');

        // Click the X button
        cy.contains('X').click();

        // Verify message is no longer visible
        cy.contains('Please enter both password fields').should('not.exist');
    });

    it('should navigate to login page when back to login is clicked', () => {
        // Click the back to login link
        cy.contains('Back to login').click();

        // Verify URL is correct
        cy.url().should('include', '/landing');
    });

});
