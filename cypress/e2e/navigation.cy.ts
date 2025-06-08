describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.waitForPageLoad()
  })

  it('should navigate to chatbot page', () => {
    cy.contains('Asistente').click()
    cy.url().should('include', '/chatbot')
    cy.get('h1').should('contain', 'Asistente de Cursos UC')
  })

  it('should navigate to login page', () => {
    cy.contains('Ingresar').click()
    cy.url().should('include', '/login')
    cy.get('h2').should('contain', 'Iniciar Sesión')
  })

  it('should navigate back to homepage from logo', () => {
    cy.contains('Asistente').click()
    cy.url().should('include', '/chatbot')
    
    cy.get('nav').within(() => {
      cy.contains('Cursos UC').click()
    })
    
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.get('h1').should('contain', 'Explora Cursos UC')
  })

  it('should show mobile menu on small screens', () => {
    cy.viewport('iphone-x')
    
    // Mobile menu button should be visible
    cy.get('button').contains('svg').should('be.visible')
    
    // Click mobile menu button
    cy.get('nav button').last().click()
    
    // Mobile menu items should be visible
    cy.contains('Explorar').should('be.visible')
    cy.contains('Asistente').should('be.visible')
    cy.contains('Ingresar').should('be.visible')
  })

  it('should highlight active navigation item', () => {
    // Check homepage is active
    cy.get('nav').within(() => {
      cy.contains('Explorar').should('have.class', 'bg-white/20')
    })
    
    // Navigate to chatbot and check it's active
    cy.contains('Asistente').click()
    cy.get('nav').within(() => {
      cy.contains('Asistente').should('have.class', 'bg-white/20')
    })
  })
})