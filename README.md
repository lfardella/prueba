# Cursos UC

Una plataforma web para explorar, evaluar y organizar cursos de la Universidad Católica de Chile.

## Características

- 🔍 Búsqueda avanzada de cursos por código, nombre y filtros
- 💬 Asistente virtual para recomendaciones personalizadas
- ⭐ Sistema de valoraciones y comentarios
- 📋 Listas personalizadas para organizar cursos
- 👤 Autenticación con correo UC

## Tecnologías

- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Lucide Icons

## Inicio Rápido

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/cursos-uc.git
cd cursos-uc
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## Estructura del Proyecto

```
src/
├── api/          # Servicios de API
├── components/   # Componentes React reutilizables
├── context/     # Contextos de React
├── pages/       # Páginas principales
└── types/       # Definiciones de TypeScript
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Vista previa de la versión de producción
- `npm run lint`: Ejecuta el linter
- `npm run test`: Ejecuta las pruebas unitarias con Vitest

## Running Behaviour Tests

Este proyecto utiliza [Cypress](https://www.cypress.io/) para pruebas end-to-end (E2E) que verifican el comportamiento completo de la aplicación desde la perspectiva del usuario.

### Ejecutar Pruebas Localmente

#### Modo Interactivo (Recomendado para Desarrollo)
```bash
# Abre la interfaz gráfica de Cypress
npm run cypress:open

# O alternativamente
npm run test:e2e:open
```

#### Modo Headless (Para CI/CD)
```bash
# Ejecuta todas las pruebas en modo headless
npm run cypress:run

# O alternativamente
npm run test:e2e
```

### Estructura de Pruebas

Las pruebas están organizadas en `cypress/e2e/` y cubren:

- **Homepage** (`homepage.cy.ts`): Carga de la página principal, navegación y elementos básicos
- **Navigation** (`navigation.cy.ts`): Navegación entre páginas y menús responsivos
- **Search** (`search.cy.ts`): Funcionalidad de búsqueda y filtros de cursos
- **Course Details** (`course-details.cy.ts`): Páginas de detalles de cursos y comentarios
- **Chatbot** (`chatbot.cy.ts`): Interfaz del asistente virtual y mensajería
- **Authentication** (`authentication.cy.ts`): Flujos de login, registro y verificación

### Comandos Personalizados

El proyecto incluye comandos personalizados de Cypress para facilitar las pruebas:

- `cy.loginAsTestUser()`: Inicia sesión con credenciales de prueba
- `cy.waitForPageLoad()`: Espera a que la página cargue completamente
- `cy.searchCourses(query)`: Realiza una búsqueda de cursos
- `cy.isInViewport()`: Verifica si un elemento está visible en el viewport

### Integración Continua (CI)

Las pruebas de Cypress se ejecutan automáticamente en GitHub Actions en cada:
- Push a las ramas `main` y `develop`
- Pull Request hacia `main` y `develop`

El workflow de CI:
1. Instala las dependencias del proyecto
2. Ejecuta el linter
3. Construye la aplicación
4. Inicia el servidor de desarrollo
5. Ejecuta las pruebas de Cypress en modo headless
6. Sube capturas de pantalla y videos en caso de fallos

### Configuración de Pruebas

La configuración de Cypress se encuentra en `cypress.config.ts` y incluye:
- URL base: `http://localhost:5173`
- Timeouts configurados para la aplicación
- Configuración de capturas de pantalla y videos
- Patrones de archivos de prueba

### Mejores Prácticas

1. **Datos de Prueba**: Las pruebas utilizan datos mock y credenciales de prueba
2. **Selectores Estables**: Se priorizan selectores por contenido de texto sobre clases CSS
3. **Esperas Inteligentes**: Se utilizan esperas explícitas en lugar de esperas fijas
4. **Aislamiento**: Cada prueba es independiente y no depende del estado de otras pruebas
5. **Responsive Testing**: Se incluyen pruebas para diferentes tamaños de viewport

### Solución de Problemas

Si las pruebas fallan localmente:

1. Asegúrate de que el servidor de desarrollo esté ejecutándose en `http://localhost:5173`
2. Verifica que todas las dependencias estén instaladas: `npm install`
3. Limpia la caché de Cypress: `npx cypress cache clear`
4. Ejecuta las pruebas en modo interactivo para debugging: `npm run cypress:open`

## Contribuir

1. Crea un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Contribuir con Pruebas

Al agregar nuevas funcionalidades:

1. Escribe pruebas E2E correspondientes en `cypress/e2e/`
2. Asegúrate de que las pruebas pasen localmente
3. Las pruebas se ejecutarán automáticamente en CI al crear el PR
4. Incluye casos de prueba para diferentes escenarios (éxito, error, edge cases)

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.