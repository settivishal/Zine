const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login') // Adjust the URL as needed
  })

  it('displays the login form', () => {
    cy.get('input[type="text"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button').contains('Log In').should('be.visible')
  })

  it('shows error message for empty fields', () => {
    cy.get('button').contains('Log In').click()
    cy.contains('Please enter both email/username and password.').should('be.visible')
  })

  it('handles successful login', () => {
    cy.intercept('POST', `${API_BASE_URL}/consumer/login`, {
      statusCode: 200,
      body: { accessToken: 'fake-access-token', refreshToken: 'fake-refresh-token' }
    }).as('loginRequest')

    cy.get('input[type="text"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button').contains('Log In').click()

    cy.wait('@loginRequest')
    cy.url().should('include', '/home')
  })

  it('handles failed login', () => {
    cy.intercept('POST', `${API_BASE_URL}/consumer/login`, {
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    }).as('loginRequest')

    cy.get('input[type="text"]').type('wrong@example.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button').contains('Log In').click()

    cy.wait('@loginRequest')
    cy.contains('Invalid credentials').should('be.visible')
  })

  it('navigates to forgot password page', () => {
    cy.contains('Forgot password?').click()
    cy.url().should('include', '/Forgot')
  })
})
