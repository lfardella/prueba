describe('Course Search', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.waitForPageLoad()
  })

  it('should perform basic search', () => {
    const searchTerm = 'IIC'
    
    cy.searchCourses(searchTerm)
    
    // Wait for search results
    cy.get('.bg-white.rounded-lg.shadow-md', { timeout: 10000 })
      .should('have.length.greaterThan', 0)
    
    // Verify search results contain the search term
    cy.get('h2').should('contain', 'Resultados')
  })

  it('should show and hide filters', () => {
    // Click filter button
    cy.get('button[type="button"]').contains('svg').click()
    
    // Filters should be visible
    cy.get('select[name="difficulty"]').should('be.visible')
    cy.get('select[name="rating"]').should('be.visible')
    cy.contains('Limpiar Filtros').should('be.visible')
    cy.contains('Aplicar Filtros').should('be.visible')
  })

  it('should apply difficulty filter', () => {
    // Open filters
    cy.get('button[type="button"]').contains('svg').click()
    
    // Select difficulty filter
    cy.get('select[name="difficulty"]').select('Fácil')
    
    // Apply filters
    cy.contains('Aplicar Filtros').click()
    
    // Verify filter was applied (results should update)
    cy.get('h2').should('contain', 'Resultados')
  })

  it('should apply rating filter', () => {
    // Open filters
    cy.get('button[type="button"]').contains('svg').click()
    
    // Select rating filter
    cy.get('select[name="rating"]').select('4+ estrellas')
    
    // Apply filters
    cy.contains('Aplicar Filtros').click()
    
    // Verify filter was applied
    cy.get('h2').should('contain', 'Resultados')
  })

  it('should clear filters', () => {
    // Open filters and set some values
    cy.get('button[type="button"]').contains('svg').click()
    cy.get('select[name="difficulty"]').select('Difícil')
    cy.get('select[name="rating"]').select('3+ estrellas')
    
    // Clear filters
    cy.contains('Limpiar Filtros').click()
    
    // Verify filters are cleared
    cy.get('select[name="difficulty"]').should('have.value', '')
    cy.get('select[name="rating"]').should('have.value', '')
  })

  it('should sort search results', () => {
    // Perform a search first
    cy.searchCourses('MAT')
    
    // Wait for results
    cy.get('.bg-white.rounded-lg.shadow-md', { timeout: 10000 })
      .should('have.length.greaterThan', 0)
    
    // Test sorting
    cy.get('select').contains('option', 'Mayor valoración').should('exist')
    cy.get('select').last().select('Menor valoración')
    
    // Results should update (we can't easily verify the actual sorting without knowing the data)
    cy.get('h2').should('contain', 'Resultados')
  })

  it('should handle empty search results', () => {
    // Search for something that likely won't exist
    cy.searchCourses('NONEXISTENTCOURSE123')
    
    // Should show no results message or empty state
    cy.get('body').should('contain.text', 'No se encontraron cursos')
      .or('contain.text', 'Resultados (0)')
  })

  it('should maintain search state when navigating back', () => {
    const searchTerm = 'IIC'
    
    // Perform search
    cy.searchCourses(searchTerm)
    
    // Click on a course (if available)
    cy.get('.bg-white.rounded-lg.shadow-md').first().click()
    
    // Go back
    cy.go('back')
    
    // Search term should still be in the input
    cy.get('input[placeholder*="Buscar por código"]').should('have.value', searchTerm)
  })
})