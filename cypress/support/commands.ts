/// <reference types="cypress" />

// Custom commands for Cursos UC application

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login with test credentials
       * @example cy.loginAsTestUser()
       */
      loginAsTestUser(): Chainable<void>
      
      /**
       * Custom command to wait for page to load completely
       * @example cy.waitForPageLoad()
       */
      waitForPageLoad(): Chainable<void>
      
      /**
       * Custom command to search for courses
       * @example cy.searchCourses('IIC2233')
       */
      searchCourses(query: string): Chainable<void>
      
      /**
       * Custom command to check if element is visible in viewport
       * @example cy.get('.element').isInViewport()
       */
      isInViewport(): Chainable<void>
    }
  }
}

// Login command for testing
Cypress.Commands.add('loginAsTestUser', () => {
  cy.visit('/login')
  cy.get('input[type="email"]').type('test@uc.cl')
  cy.get('input[type="password"]').type('testpassword')
  cy.get('button[type="submit"]').click()
  
  // Handle potential verification step
  cy.url().then((url) => {
    if (url.includes('/login')) {
      // If still on login page, might need verification
      cy.get('body').then(($body) => {
        if ($body.find('input[maxlength="6"]').length > 0) {
          cy.get('input[maxlength="6"]').type('123456')
          cy.get('button[type="submit"]').click()
        }
      })
    }
  })
  
  // Wait for redirect to home page
  cy.url().should('eq', Cypress.config().baseUrl + '/')
})

// Wait for page load
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible')
  cy.window().should('have.property', 'document')
  cy.document().should('have.property', 'readyState', 'complete')
})

// Search courses command
Cypress.Commands.add('searchCourses', (query: string) => {
  cy.get('input[placeholder*="Buscar por código"]').clear().type(query)
  cy.get('input[placeholder*="Buscar por código"]').type('{enter}')
})

// Check if element is in viewport
Cypress.Commands.add('isInViewport', { prevSubject: true }, (subject) => {
  cy.wrap(subject).should('be.visible')
  cy.window().then((window) => {
    const element = subject[0]
    const rect = element.getBoundingClientRect()
    expect(rect.top).to.be.at.least(0)
    expect(rect.left).to.be.at.least(0)
    expect(rect.bottom).to.be.at.most(window.innerHeight)
    expect(rect.right).to.be.at.most(window.innerWidth)
  })
})