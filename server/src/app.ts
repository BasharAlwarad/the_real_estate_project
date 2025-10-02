import express from 'express';
import cors from 'cors';
import mongoDbConnect from './db/mongodb.js';
import {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from './controllers/listingsControllers.js';

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from './controllers/UsersControllers.js';

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

// GET all listings
app.get('/listings', getAllListings);

// GET listing by ID
app.get('/listings/:id', getListingById);

// POST create new listing
app.post('/listings', createListing);

// PUT update listing by ID
app.put('/listings/:id', updateListing);

// DELETE listing by ID
app.delete('/listings/:id', deleteListing);

// GET all users
app.get('/users', getAllUsers);

// GET user by ID
app.get('/users/:id', getUserById);

// POST create new user
app.post('/users', createUser);

// PUT update user by ID
app.put('/users/:id', updateUser);

// DELETE user by ID
app.delete('/users/:id', deleteUser);

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
