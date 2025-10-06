import express from 'express';
import cors from 'cors';
import { mongoDBConnect } from '#db';
import { userRouter, listingRouter } from '#routes';
import { errorHandler } from './middlewares/errorHandler.js';

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

// Test route for error handling
app.get('/test-error', (req, res, next) => {
  try {
    // Simulate an error
    throw new Error('This is a test error');
  } catch (error) {
    next(error);
  }
});

app.use(`/listings`, listingRouter);
app.use(`/users`, userRouter);

// Error handling middleware - must be after routes
app.use(errorHandler);

// 404 catch-all route - must be last
app.use(/.*/, (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
  });
});

app.listen(PORT, () =>
  console.log('server is running 🏃 on http://localhost:3000')
);
