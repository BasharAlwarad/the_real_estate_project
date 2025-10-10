import { Router } from 'express';
import swaggerJSDoc, { type Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import packageJson from '../../package.json' with { type: 'json' };

const docsRouter = Router();

const options: Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Real Estate API',
      description: `
# Real Estate Management API

A comprehensive RESTful API for managing real estate listings and user accounts.

## Key Features
- 🏠 **Listing Management**: Create, read, update, and delete real estate listings
- 👥 **User Management**: Complete user account lifecycle management  
- 📸 **Image Upload**: Support for multiple image input methods (file upload, URL, default)
- 🔧 **Form Data Support**: Handles both JSON and multipart/form-data requests
- ⚡ **Error Handling**: Comprehensive error responses with proper HTTP status codes
- 📝 **Validation**: Request validation using Zod schemas

## Technology Stack
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Cloudinary integration
- **Validation**: Zod schema validation
- **Documentation**: OpenAPI 3.1.0 with Swagger UI

## Getting Started
1. Ensure MongoDB is running
2. Set up environment variables (see README)
3. Install dependencies: \`npm install\`
4. Start development server: \`npm run dev\`
5. Visit this documentation at: http://localhost:3000/docs

## Support
For issues and questions, contact the development team.
      `,
      version: packageJson.version,
      contact: {
        name: 'Real Estate Development Team',
        email: 'dev@realestate.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.realestate.com',
        description: 'Production server'
      }
    ]
  },
  // Now using separate YAML files + existing TypeScript schemas
  apis: [
    './src/schemas/*.ts',           // Keep existing schemas for comments
    './src/docs/*.yaml',            // Add separate YAML documentation files
    './src/docs/schemas/*.yaml',    // Add schema YAML files
    './src/docs/main.yaml'          // Main configuration
  ]
};
const swaggerSpec = swaggerJSDoc(options);
 
docsRouter.get('/openapi.json', (req, res) => {res.json(swaggerSpec)})
docsRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
 
export default docsRouter;