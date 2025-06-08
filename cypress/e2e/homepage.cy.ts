describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.waitForPageLoad()
  })

  it('should load the homepage successfully', () => {
    cy.title().should('contain', 'Cursos UC')
    cy.get('h1').should('contain', 'Explora Cursos UC')
    cy.get('p').should('contain', 'Encuentra información detallada')
  })

  it('should display the navigation bar with correct links', () => {
    cy.get('nav').should('be.visible')
    cy.get('nav').within(() => {
      cy.contains('Cursos UC').should('be.visible')
      cy.contains('Explorar').should('be.visible')
      cy.contains('Asistente').should('be.visible')
      cy.contains('Ingresar').should('be.visible')
    })
  })

  it('should display the search bar', () => {
    cy.get('input[placeholder*="Buscar por código"]').should('be.visible')
    cy.get('button').contains('Filter').should('be.visible')
  })

  it('should display course cards when courses are loaded', () => {
    // Wait for courses to load
    cy.get('[data-testid="course-card"], .bg-white.rounded-lg.shadow-md', { timeout: 10000 })
      .should('have.length.greaterThan', 0)
    
    // Check first course card structure
    cy.get('[data-testid="course-card"], .bg-white.rounded-lg.shadow-md').first().within(() => {
      cy.get('h3, h4').should('exist') // Course code or name
      cy.get('.text-lg, .text-xl').should('exist') // Course title
    })
  })

  it('should show loading state initially', () => {
    cy.visit('/')
    // Check for loading indicators (skeleton or spinner)
    cy.get('.animate-pulse, .animate-spin').should('exist')
  })

  it('should display the footer', () => {
    cy.get('footer').should('be.visible')
    cy.get('footer').within(() => {
      cy.contains('Cursos UC').should('be.visible')
      cy.contains('Plataforma desarrollada por y para estudiantes UC').should('be.visible')
      cy.contains(new Date().getFullYear().toString()).should('be.visible')
    })
  })

  it('should be responsive on mobile viewport', () => {
    cy.viewport('iphone-x')
    cy.get('nav').should('be.visible')
    cy.get('h1').should('be.visible')
    cy.get('input[placeholder*="Buscar por código"]').should('be.visible')
  })
})