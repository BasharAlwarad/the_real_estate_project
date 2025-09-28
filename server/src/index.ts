import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Real Estate API Server is running!' });
});

app.get('/api/properties', (req, res) => {
  res.json({
    message: 'Properties endpoint',
    properties: [
      {
        id: 1,
        title: 'Modern Downtown Apartment',
        price: 450000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        location: 'Downtown',
        type: 'Apartment'
      },
      {
        id: 2,
        title: 'Suburban Family House',
        price: 650000,
        bedrooms: 4,
        bathrooms: 3,
        area: 2400,
        location: 'Suburbs',
        type: 'House'
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});