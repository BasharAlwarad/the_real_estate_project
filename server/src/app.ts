import express from 'express';
import cors from 'cors';
import { mongoDBConnect } from '#db';
import { userRouter, listingRouter, docsRouter, authRouter } from '#routes';
import { errorHandler } from '#middlewares';

/**
 * Express application setup
 *
 * Main application entry point that configures Express server with:
 * - CORS middleware for cross-origin requests
 * - JSON parsing middleware
 * - MongoDB database connection
 * - Route handlers for users, listings, and API documentation
 *
 * API documentation is maintained externally in: /docs/api/
 */

const app = express();
const PORT = process.env.PORT;

// Middleware
// CORS: allow any origin in development; single origin in non-dev via CORS_ORIGIN
const isDev = process.env.NODE_ENV === 'development';
const corsOptions = {
  // true reflects the request origin (not '*'), required for credentials
  origin: isDev ? true : process.env.CORS_ORIGIN || false,
  credentials: true,
} as const;

app.use(cors(corsOptions));
// Handle preflight for all routes (Express 5: use regex instead of '*')
app.options(/.*/, cors(corsOptions));
app.use(express.json());

// Initialize database
mongoDBConnect();

// Routes
app.get('/', (req, res) => {
  try {
    res.send('server is working on 3000');
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
  }
});

app.use(`/listings`, listingRouter);
app.use(`/users`, userRouter);
app.use(`/docs`, docsRouter);
app.use(`/auth`, authRouter);

app.use(errorHandler);

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
