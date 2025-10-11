import express from 'express';
import cors from 'cors';
import { mongoDBConnect } from '#db';
import { userRouter, listingRouter, docsRouter } from '#routes';

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
app.use(cors());
app.use(express.json());

// Initialize database
mongoDBConnect();

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
