import express from 'express';
import cors from 'cors';
import mongoDbConnect from './db/mongodb.js';
import usersRouter from './routes/UsersRoutes.js';
import listingsRouter from './routes/ListingsRoutes.js';

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
mongoDbConnect();
// Routes
app.get('/', (req, res) => {
  try {
    res.send('server is working on 3000');
  } catch (error) {
    console.error(error.message);
  }
});

app.use(`/listings`, listingsRouter);
app.use(`/users`, usersRouter);

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
