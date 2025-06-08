describe('Chatbot', () => {
  beforeEach(() => {
    cy.visit('/chatbot')
    cy.waitForPageLoad()
  })

  it('should display chatbot interface', () => {
    cy.get('h1').should('contain', 'Asistente de Cursos UC')
    cy.get('h2').should('contain', 'Asistente de Cursos UC')
    cy.contains('Pregúntame sobre cursos').should('be.visible')
  })

  it('should show welcome message and quick actions', () => {
    cy.contains('¡Hola! Soy el asistente de Cursos UC').should('be.visible')
    cy.contains('¿Qué OFGs me recomiendas?').should('be.visible')
    cy.contains('Cursos de ingeniería fáciles').should('be.visible')
    cy.contains('Cursos bien evaluados').should('be.visible')
    cy.contains('Cursos más populares').should('be.visible')
  })

  it('should send a message using quick action buttons', () => {
    cy.contains('¿Qué OFGs me recomiendas?').click()
    
    // Should show user message
    cy.contains('¿Qué OFGs me recomiendas?').should('be.visible')
    
    // Should show bot response (with loading state)
    cy.get('.bg-white.border.border-gray-200', { timeout: 10000 })
      .should('contain.text', 'OFG')
  })

  it('should send a custom message', () => {
    const message = 'Necesito ayuda con cursos de matemáticas'
    
    cy.get('input[placeholder="Escribe tu consulta..."]').type(message)
    cy.get('button[type="submit"]').click()
    
    // Should show user message
    cy.contains(message).should('be.visible')
    
    // Should show bot response
    cy.get('.bg-white.border.border-gray-200', { timeout: 10000 })
      .should('exist')
  })

  it('should handle empty message submission', () => {
    // Try to submit empty message
    cy.get('button[type="submit"]').click()
    
    // Should not send empty message
    cy.get('.bg-\\[\\#851539\\]').should('not.exist')
  })

  it('should disable input while loading', () => {
    cy.contains('¿Qué OFGs me recomiendas?').click()
    
    // Input should be disabled while loading
    cy.get('input[placeholder="Escribe tu consulta..."]').should('be.disabled')
    cy.get('button[type="submit"]').should('be.disabled')
  })

  it('should scroll to bottom when new messages arrive', () => {
    // Send multiple messages to create scroll
    cy.contains('¿Qué OFGs me recomiendas?').click()
    cy.wait(1000)
    
    cy.get('input[placeholder="Escribe tu consulta..."]').should('not.be.disabled')
    cy.get('input[placeholder="Escribe tu consulta..."]').type('Otra pregunta')
    cy.get('button[type="submit"]').click()
    
    // The chat should auto-scroll to show latest messages
    cy.get('.bg-white.border.border-gray-200').last().should('be.visible')
  })

  it('should display message timestamps', () => {
    cy.contains('¿Qué OFGs me recomiendas?').click()
    
    // Should show timestamp for user message
    cy.get('.text-xs.ml-auto.opacity-75').should('exist')
  })

  it('should show information section', () => {
    cy.contains('¿Cómo puedo usar el asistente?').should('be.visible')
    cy.contains('Recomendaciones de cursos basadas en tus intereses').should('be.visible')
    cy.contains('Información sobre la dificultad y carga académica').should('be.visible')
  })

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-x')
    
    cy.get('h1').should('be.visible')
    cy.get('input[placeholder="Escribe tu consulta..."]').should('be.visible')
    cy.contains('¿Qué OFGs me recomiendas?').should('be.visible')
  })
})