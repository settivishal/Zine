const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
describe('Home Page', () => {
  beforeEach(() => {
    // Set future expiration date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); // Set to tomorrow
    const expiresAt = futureDate.toISOString();

    // Mock both cookies before visiting the page
    cy.setCookie('accessToken', 'fake-token');
    cy.setCookie('expires_at', expiresAt);

    // Visit the home page
    cy.visit('http://localhost:3000/home');
  });

  // Test that we stay on home page when authenticated
  it('should remain on home page when authenticated', () => {
    cy.url().should('include', '/home');
  });

  //Test Navbar presence and functionality
  describe('Navbar', () => {
    it('should display the navbar', () => {
      cy.get('nav').should('exist');
      cy.get('img[alt="Logo"]').should('be.visible');
    });

    it('should navigate landing when logo is clicked', () => {
      cy.get('img[alt="Logo"]').click();
      cy.url().should('include', '/landing');
    });
  });

  // Add Tags component tests before BlogList tests
  describe('Tags Component', () => {
    beforeEach(() => {
      // Mock the initial tags fetch - this matches the actual API response
      cy.intercept('GET', `${API_BASE_URL}/api/tags`, {
        statusCode: 200,
        body: [
          { text: 'Tag1', color: '#ff0000' },
          { text: 'Tag2', color: '#00ff00' }
        ]
      }).as('getTags');
    });

    it('should display tags section', () => {
      cy.contains('Tags').should('be.visible');
    });
  });

  // Update BlogList tests to match the correct tag structure
  describe('BlogList', () => {
    beforeEach(() => {
      // Mock the API responses
      cy.intercept('GET', `${API_BASE_URL}/api/blogs*`, {
        statusCode: 200,
        body: {
          blogs: {
            '2024-03-20': {
              id: '1',
              title: 'Test Blog',
              excerpt: 'Test excerpt',
              tagIds: ['1', '2']
            }
          }
        }
      }).as('getBlogs');

      // This call happens when tags need to be fetched for blog cards
      cy.intercept('POST', `${API_BASE_URL}/api/tags/getByIDs`, {
        statusCode: 200,
        body: [
          { text: 'Tag1', color: '#ff0000' },
          { text: 'Tag2', color: '#00ff00' }
        ]
      }).as('getTagsByIDs');

      // This is for the general tags list
      cy.intercept('GET', `${API_BASE_URL}/api/tags`, {
        statusCode: 200,
        body: [
          { text: 'Tag1', color: '#ff0000' },
          { text: 'Tag2', color: '#00ff00' }
        ]
      }).as('getTags');

      // Visit the home page where both endpoints will be called
      cy.visit('http://localhost:3000/home');

      // Wait for both critical requests to complete
      cy.wait(['@getBlogs', '@getTags']);
    });

    it('should display blog list title', () => {
      cy.contains('My Blogs').should('be.visible');
    });

    it('should display blog cards', () => {
      cy.get('.MuiCard-root').should('exist');
      cy.contains('Test Blog').should('be.visible');
      cy.contains('Test excerpt').should('be.visible');
    });

    it('should allow adding tags to blogs', () => {
      cy.intercept('POST', `${API_BASE_URL}/api/tag/set`, {
        statusCode: 200,
        body: { success: true }
      }).as('addTag');

      cy.contains('Add Tag').first().click();
      cy.get('.MuiDialog-root').should('be.visible');
      cy.get('.MuiDialog-root').contains('Tag1').click();

      // Verify the API call payload
      cy.wait('@addTag').its('request.body').should('have.keys', ['text', 'date']);
    });

    it('should handle creating new blog', () => {
      cy.intercept('POST', `${API_BASE_URL}/api/blog/create`, {
        statusCode: 200,
        body: { blog_url: '/blogs/new-blog' }
      }).as('createBlog');

      cy.contains('Create New Blog').click();
      cy.wait('@createBlog');
      cy.url().should('include', '/blogs/new-blog');
    });

    it('should disable Create New Blog button if blog exists for today', () => {
      const today = new Date().toISOString().split('T')[0];
      cy.intercept('GET', `${API_BASE_URL}/api/blogs*`, {
        statusCode: 200,
        body: {
          blogs: {
            [today]: {
              id: '1',
              title: "Today's Blog",
              excerpt: 'Test excerpt'
            }
          }
        }
      }).as('getTodaysBlog');

      cy.visit('http://localhost:3000/home');
      cy.wait('@getTodaysBlog');
      cy.contains('Create New Blog').should('be.disabled');
    });

  });

});
