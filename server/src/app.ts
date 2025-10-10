import express from 'express';
import cors from 'cors';
import { mongoDBConnect } from '#db';
import { userRouter, listingRouter, docsRouter } from '#routes';

/**
 * @openapi
 * info:
 *   title: Real Estate API
 *   description: |
 *     A comprehensive API for managing real estate listings and user accounts.
 *
 *     ## Features
 *     - User account management with profile image upload
 *     - Real estate listing CRUD operations
 *     - Image upload support via Cloudinary
 *     - Form data and JSON request support
 *     - Comprehensive error handling
 *
 *     ## Authentication
 *     Currently, this API doesn't require authentication, but it's ready for implementation.
 *
 *     ## Image Upload
 *     The API supports multiple image input methods:
 *     - File upload (multipart/form-data)
 *     - Image URL
 *     - Default system images
 *
 *   version: 1.0.0
 *   contact:
 *     name: Real Estate Development Team
 *     email: dev@realestate.com
 *   license:
 *     name: MIT
 *     url: https://opensource.org/licenses/MIT
 *
 * servers:
 *   - url: http://localhost:3000
 *     description: Development server
 *   - url: https://api.realestate.com
 *     description: Production server (when deployed)
 *
 * tags:
 *   - name: Users
 *     description: User account management operations
 *   - name: Listings
 *     description: Real estate listing management operations
 *   - name: Health
 *     description: API health and status endpoints
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token for authentication (future implementation)
 */

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
mongoDBConnect();

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - Health
 *     summary: API Health Check
 *     description: Check if the API server is running and healthy
 *     responses:
 *       200:
 *         description: Server is running successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "server is working on 3000"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

// Routes
app.get('/', (req, res) => {
  try {
    res.send('server is working on 3000');
  } catch (error) {
    console.error(error.message);
  }
});

app.use(`/listings`, listingRouter);
app.use(`/users`, userRouter);
app.use(`/docs`, docsRouter);

/**
 * @openapi
 * /*:
 *   get:
 *     tags:
 *       - Health
 *     summary: 404 - Route Not Found
 *     description: Catch-all route for undefined endpoints
 *     responses:
 *       404:
 *         description: The requested route was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Route not found"
 *                 message:
 *                   type: string
 *                   example: "The requested endpoint /unknown does not exist"
 *   post:
 *     tags:
 *       - Health
 *     summary: 404 - Route Not Found
 *     description: Catch-all route for undefined endpoints
 *     responses:
 *       404:
 *         description: The requested route was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Route not found"
 *                 message:
 *                   type: string
 *                   example: "The requested endpoint /unknown does not exist"
 *   put:
 *     tags:
 *       - Health
 *     summary: 404 - Route Not Found
 *     description: Catch-all route for undefined endpoints
 *     responses:
 *       404:
 *         description: The requested route was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Route not found"
 *                 message:
 *                   type: string
 *                   example: "The requested endpoint /unknown does not exist"
 *   delete:
 *     tags:
 *       - Health
 *     summary: 404 - Route Not Found
 *     description: Catch-all route for undefined endpoints
 *     responses:
 *       404:
 *         description: The requested route was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Route not found"
 *                 message:
 *                   type: string
 *                   example: "The requested endpoint /unknown does not exist"
 */

// 404 catch-all route - must be last
app.use(/.*/, (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
  });
});

app.listen(PORT, () =>
  console.log('⏩⏩⏩ Server is running 🏃 on http://localhost:3000')
);
