import { Router } from 'express';
import swaggerJSDoc, { type Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

const docsRouter = Router();

/**
 * Load the external OpenAPI specification - Test Mode
 *
 * This configuration loads the complete API documentation from external YAML files
 * located in the /docs/api/ directory, keeping all documentation separate from
 * the application code for better maintainability.
 */

try {
  // Load the main OpenAPI specification from external docs folder
  const openApiPath = join(process.cwd(), '../docs/api/openapi.yaml');
  const openApiContent = readFileSync(openApiPath, 'utf8');
  const swaggerSpec = yaml.load(openApiContent) as object;

  // Serve the OpenAPI spec as JSON
  docsRouter.get('/openapi.json', (req, res) => {
    res.json(swaggerSpec);
  });

  // Serve Swagger UI
  docsRouter.use(
    '/',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Real Estate API Documentation',
      customCssUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'list',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
      },
    })
  );
} catch (error) {
  console.error('Failed to load external OpenAPI documentation:', error);

  // Fallback: Create a minimal error documentation
  const fallbackSpec = {
    openapi: '3.1.0',
    info: {
      title: 'Real Estate API - Documentation Error',
      version: '1.0.0',
      description:
        'Error loading external documentation. Please check the /docs/api/ folder.',
    },
    paths: {},
  };

  docsRouter.get('/openapi.json', (req, res) => {
    res.json(fallbackSpec);
  });

  docsRouter.use('/', swaggerUi.serve, swaggerUi.setup(fallbackSpec));
}

export default docsRouter;
