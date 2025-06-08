describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.waitForPageLoad()
  })

  it('should display login form', () => {
    cy.get('h2').should('contain', 'Iniciar Sesión')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('contain', 'Iniciar Sesión')
  })

  it('should toggle between login and register forms', () => {
    // Should start with login form
    cy.get('h2').should('contain', 'Iniciar Sesión')
    
    // Click register link
    cy.contains('Regístrate').click()
    
    // Should show register form
    cy.get('h2').should('contain', 'Crear Cuenta')
    cy.get('input[type="text"]').should('be.visible') // Name field
    cy.get('button[type="submit"]').should('contain', 'Crear Cuenta')
    
    // Click login link
    cy.contains('Inicia sesión').click()
    
    // Should show login form again
    cy.get('h2').should('contain', 'Iniciar Sesión')
  })

  it('should validate email format', () => {
    cy.get('input[type="email"]').type('invalid-email')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    
    // Should show validation error or prevent submission
    cy.get('input[type="email"]:invalid').should('exist')
  })

  it('should handle login attempt', () => {
    cy.get('input[type="email"]').type('test@uc.cl')
    cy.get('input[type="password"]').type('testpassword')
    cy.get('button[type="submit"]').click()
    
    // Should either redirect to verification or show error
    cy.url().should('not.eq', Cypress.config().baseUrl + '/login')
      .or(() => {
        cy.get('.text-red-700, .text-red-600').should('exist')
      })
  })

  it('should handle registration attempt', () => {
    // Switch to register form
    cy.contains('Regístrate').click()
    
    cy.get('input[type="email"]').type('newuser@uc.cl')
    cy.get('input[type="text"]').type('Test User')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    
    // Should either show verification screen or error
    cy.get('body').should(($body) => {
      const hasVerification = $body.text().includes('Verificación') ||
                             $body.text().includes('código')
      const hasError = $body.find('.text-red-700, .text-red-600').length > 0
      expect(hasVerification || hasError).to.be.true
    })
  })

  it('should handle verification flow', () => {
    // Register first
    cy.contains('Regístrate').click()
    cy.get('input[type="email"]').type('newuser@uc.cl')
    cy.get('input[type="text"]').type('Test User')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    
    // If verification screen appears
    cy.get('body').then(($body) => {
      if ($body.text().includes('Verificación')) {
        cy.get('input[maxlength="6"]').type('123456')
        cy.get('button[type="submit"]').click()
        
        // Should redirect to home or show error
        cy.url().should('not.include', '/login')
          .or(() => {
            cy.get('.text-red-700, .text-red-600').should('exist')
          })
      }
    })
  })

  it('should show loading states', () => {
    cy.get('input[type="email"]').type('test@uc.cl')
    cy.get('input[type="password"]').type('testpassword')
    cy.get('button[type="submit"]').click()
    
    // Should show loading text
    cy.get('button[type="submit"]').should('contain', 'Iniciando sesión...')
      .or('be.disabled')
  })

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-x')
    
    cy.get('h2').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('should navigate back to home from login', () => {
    cy.get('nav').within(() => {
      cy.contains('Cursos UC').click()
    })
    
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})