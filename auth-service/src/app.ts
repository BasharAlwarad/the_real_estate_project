/**
 * =============================================================================
 * AUTH MICROSERVICE - Main Application
 * =============================================================================
 *
 * This file is the entry point for the Authentication Microservice, which is
 * a dedicated service separated from the main application to handle ALL
 * authentication-related operations.
 *
 * 🏗️ MICROSERVICES ARCHITECTURE:
 *
 * This service is part of a microservices architecture where responsibilities
 * are separated into focused, independent services:
 *
 * - Auth Service (THIS FILE): Port 4000 - Authentication & token management
 * - Main Server: Port 3000 - Business logic (users, listings)
 * - Client: Port 5173 - React frontend
 *
 * 🔐 RESPONSIBILITIES:
 *
 * 1. User Registration (Signup)
 *    - Validate user input
 *    - Hash passwords with bcrypt
 *    - Store user in database
 *    - Auto-login with JWT tokens
 *
 * 2. User Login
 *    - Validate credentials
 *    - Generate JWT access token (15 min expiry)
 *    - Generate JWT refresh token (7 day expiry)
 *    - Store tokens as httpOnly cookies
 *
 * 3. Token Management
 *    - Refresh expired access tokens
 *    - Revoke tokens on logout
 *    - Store hashed refresh tokens in database
 *    - Verify tokens for inter-service communication
 *
 * 4. Session Management
 *    - Track active sessions
 *    - Provide current user information
 *    - Handle logout with token cleanup
 *
 * 🔒 SECURITY FEATURES:
 *
 * - Passwords hashed with bcrypt (12 rounds)
 * - Refresh tokens hashed before database storage
 * - httpOnly cookies prevent XSS attacks
 * - Short-lived access tokens limit exposure
 * - CORS configured for specific origins
 * - JWT signed with secret key
 *
 * 🔄 HOW IT WORKS:
 *
 * Client Request Flow:
 * 1. Client sends auth request to http://localhost:4000/auth/login
 * 2. This service validates credentials
 * 3. Generates and returns JWT tokens as httpOnly cookies
 * 4. Client stores cookies automatically
 * 5. Client includes cookies in subsequent requests
 * 6. Main server verifies JWT locally (no call to auth service needed!)
 *
 * Token Refresh Flow:
 * 1. Access token expires after 15 minutes
 * 2. Client interceptor catches 401 error
 * 3. Client calls /auth/refresh automatically
 * 4. This service validates refresh token
 * 5. Issues new access token
 * 6. Client retries original request
 *
 * 📁 FILE ORGANIZATION:
 *
 * - app.ts (THIS FILE) - Express application setup
 * - controllers/ - Business logic (login, signup, etc.)
 * - models/ - Database schemas (User, RefreshToken)
 * - routes/ - API endpoint definitions
 * - middlewares/ - Auth middleware, error handling
 * - db/ - Database connection
 * - utils/ - Helper functions
 *
 * =============================================================================
 */

// Import required dependencies
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { mongoDBConnect } from '#db';
import { authRouter } from '#routes';
import { errorHandler } from '#middlewares';

// Initialize Express application
const app = express();

// Configure port from environment or default to 4000
const PORT = process.env.PORT || 4000;

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

/**
 * CORS (Cross-Origin Resource Sharing) Configuration
 *
 * Allows requests from:
 * 1. Client application (React frontend on port 5173)
 * 2. Main server (for potential inter-service calls on port 3000)
 *
 * Development Mode (NODE_ENV=development):
 * - origin: true → Allows ANY origin (convenient for development)
 * - Reflects the request origin back in Access-Control-Allow-Origin header
 *
 * Production Mode:
 * - origin: [specific URLs] → Only allows whitelisted origins
 * - More secure, prevents unauthorized cross-origin requests
 *
 * credentials: true is CRITICAL for:
 * - Sending httpOnly cookies with cross-origin requests
 * - Browser will include cookies in requests to this service
 * - Required for cookie-based authentication to work
 */
const isDev = process.env.NODE_ENV === 'development';
const corsOptions = {
  origin: isDev
    ? true // Development: Allow all origins for easier testing
    : [
        process.env.CORS_ORIGIN || 'http://localhost:5173', // Client app
        process.env.MAIN_SERVER || 'http://localhost:3000', // Main server
      ],
  credentials: true, // MUST be true for cookies to work cross-origin
} as const;

// Apply CORS middleware to all routes
app.use(cors(corsOptions));

/**
 * Handle preflight OPTIONS requests
 *
 * Browsers send OPTIONS requests before actual requests when:
 * - Using non-simple methods (POST, PUT, DELETE)
 * - Using custom headers
 * - Making cross-origin requests with credentials
 *
 * This ensures ALL routes respond correctly to preflight checks
 */
app.options(/.*/, cors(corsOptions));

/**
 * JSON Body Parser
 *
 * Automatically parses JSON request bodies and makes them available
 * in req.body for controllers to access
 *
 * Example: POST /auth/login with {"email": "...", "password": "..."}
 * Controller can access: req.body.email and req.body.password
 */
app.use(express.json());

/**
 * Cookie Parser
 *
 * Parses cookies from request headers and makes them available in req.cookies
 * Essential for reading JWT tokens stored as httpOnly cookies
 *
 * Example: Browser sends cookie "accessToken=eyJhbGc..."
 * Middleware makes it available as: req.cookies.accessToken
 */
app.use(cookieParser());

// ============================================================================
// DATABASE INITIALIZATION
// ============================================================================

/**
 * Connect to MongoDB Database
 *
 * Establishes connection to MongoDB (Atlas cloud or local instance)
 * This service uses two collections:
 * 1. users - User accounts (shared with main server for read access)
 * 2. refreshtokens - Refresh token storage (exclusive to auth service)
 *
 * Connection string comes from process.env.MONGO_URL
 * If connection fails, the service will exit (see mongodb.ts)
 */
mongoDBConnect();

// ============================================================================
// ROUTE DEFINITIONS
// ============================================================================

/**
 * Health Check / Service Info Endpoint
 *
 * GET /
 *
 * Returns basic information about the auth service and available endpoints
 * Useful for:
 * - Checking if service is running
 * - Service discovery
 * - API documentation reference
 * - Monitoring/health checks
 *
 * Response: JSON with service metadata and endpoint list
 */
app.get('/', (req, res) => {
  try {
    res.json({
      service: 'Authentication Microservice',
      status: 'running',
      version: '1.0.0',
      endpoints: {
        login: 'POST /auth/login',
        signup: 'POST /auth/signup',
        refresh: 'POST /auth/refresh',
        logout: 'POST /auth/logout',
        me: 'GET /auth/me',
        verify: 'POST /auth/verify-token',
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
  }
});

/**
 * Authentication Routes
 *
 * All auth-related endpoints are prefixed with /auth
 * Handled by authRouter which includes:
 *
 * Public Endpoints (no authentication required):
 * - POST /auth/login     → User login with email/password
 * - POST /auth/signup    → New user registration
 * - POST /auth/refresh   → Refresh expired access token
 * - POST /auth/logout    → Logout and revoke refresh token
 *
 * Protected Endpoints (require valid access token):
 * - GET  /auth/me        → Get current user information
 *
 * Service Endpoints (for inter-service communication):
 * - POST /auth/verify-token → Validate JWT token
 *
 * See: src/routes/AuthRoutes.ts for route definitions
 * See: src/controllers/AuthControllers.ts for business logic
 */
app.use('/auth', authRouter);

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Global Error Handler
 *
 * Catches any errors thrown in routes or middleware and returns
 * a consistent error response format
 *
 * Features:
 * - Standardized error responses
 * - Stack traces in development mode
 * - Proper HTTP status codes
 * - Prevents server crashes from unhandled errors
 *
 * Must be registered AFTER all routes to catch their errors
 * See: src/middlewares/errorHandler.ts
 */
app.use(errorHandler);

/**
 * 404 Not Found Handler
 *
 * Catches all requests that don't match any defined routes
 * Returns a helpful error message with the attempted URL
 *
 * MUST be registered last (after all other routes and middleware)
 * Uses regex pattern to match any remaining routes
 */
app.use(/.*/, (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

/**
 * Start Express Server
 *
 * Binds the application to the specified port and starts listening
 * for incoming HTTP requests
 *
 * Port Configuration:
 * - Default: 4000 (auth service)
 * - Configurable via PORT environment variable
 *
 * Service URLs in architecture:
 * - Auth Service: http://localhost:4000
 * - Main Server:  http://localhost:3000
 * - Client:       http://localhost:5173
 */
app.listen(PORT, () =>
  console.log(`⏩⏩⏩ Auth Service is running 🔐 on http://localhost:${PORT}`)
);
