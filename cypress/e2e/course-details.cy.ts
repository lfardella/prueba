describe('Course Details', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.waitForPageLoad()
  })

  it('should navigate to course details page', () => {
    // Wait for courses to load and click on first course
    cy.get('.bg-white.rounded-lg.shadow-md', { timeout: 10000 })
      .should('have.length.greaterThan', 0)
    
    cy.get('.bg-white.rounded-lg.shadow-md').first().click()
    
    // Should be on course details page
    cy.url().should('include', '/course/')
    
    // Should show back button
    cy.contains('Volver a la búsqueda').should('be.visible')
  })

  it('should display course information', () => {
    // Navigate to a course details page
    cy.get('.bg-white.rounded-lg.shadow-md', { timeout: 10000 }).first().click()
    
    // Check for course details elements
    cy.get('h1').should('exist') // Course title
    cy.contains('Descripción').should('be.visible')
    cy.contains('Detalles del Curso').should('be.visible')
    cy.contains('Ver en Buscacursos UC').should('be.visible')
  })

  it('should show external link to Buscacursos', () => {
    cy.get('.bg-white.rounded-lg.shadow-md', { timeout: 10000 }).first().click()
    
    cy.contains('Ver en Buscacursos UC').should('be.visible')
    cy.contains('Ver en Buscacursos UC').should('have.attr', 'href')
      .and('include', 'buscacursos.uc.cl')
  })

  it('should show add to list button for logged in users', () => {
    // First login
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@uc.cl')
    cy.get('input[type="password"]').type('testpassword')
    cy.get('button[type="submit"]').click()
    
    // Handle verification if needed
    cy.url().then((url) => {
      if (url.includes('/login')) {
        cy.get('body').then(($body) => {
          if ($body.find('input[maxlength="6"]').length > 0) {
            cy.get('input[maxlength="6"]').type('123456')
            cy.get('button[type="submit"]').click()
          }
        })
      }
    })
    
    // Navigate to course details
    cy.visit('/')
    cy.get('.bg-white.rounded-lg.shadow-md', { timeout: 10000 }).first().click()
    
    // Should show add to list button
    cy.contains('Añadir a Mi Lista').should('be.visible')
  })

  it('should display comments section', () => {
    cy.get('.bg-white.rounded-lg.shadow-md', { timeout: 10000 }).first().click()
    
    cy.contains('Comentarios').should('be.visible')
    
    // Should show either comments or "no comments" message
    cy.get('body').should(($body) => {
      const hasComments = $body.find('.border-b.border-gray-200').length > 0
      const hasNoComments = $body.text().includes('Aún no hay comentarios')
      expect(hasComments || hasNoComments).to.be.true
    })
  })

  it('should go back to search results', () => {
    cy.get('.bg-white.rounded-lg.shadow-md', { timeout: 10000 }).first().click()
    
    cy.contains('Volver a la búsqueda').click()
    
    cy.url().should('not.include', '/course/')
    cy.get('h1').should('contain', 'Explora Cursos UC')
  })

  it('should handle course not found', () => {
    // Visit a non-existent course ID
    cy.visit('/course/nonexistent', { failOnStatusCode: false })
    
    // Should show error message or redirect
    cy.get('body').should(($body) => {
      const hasError = $body.text().includes('No se encontró el curso') ||
                      $body.text().includes('Error') ||
                      $body.text().includes('Explora Cursos UC') // redirected to home
      expect(hasError).to.be.true
    })
  })
})