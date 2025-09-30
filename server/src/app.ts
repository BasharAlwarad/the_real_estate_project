import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;
const client = new MongoClient(MONGO_URL);

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
await client.connect();
const db = client.db('listings');
const houseCollection = db.collection('homes');

// Routes
app.get('/', (req, res) => {
  res.send('server is working on 3000');
});

// GET all listings
app.get('/listings', async (req, res) => {
  const listings = await houseCollection.find({}).toArray();
  res.json(listings);
});

// GET listing by ID
app.get('/listings/:id', async (req, res) => {
  const { id } = req.params;

  const listing = await houseCollection.findOne({
    _id: ObjectId.createFromHexString(id),
  });

  res.json(listing);
});

// POST create new listing
app.post('/listings', async (req, res) => {
  const newListing = req.body;
  const result = await houseCollection.insertOne(newListing);
  res.status(201).json({
    message: 'Listing created successfully',
    id: result.insertedId,
  });
});

// PUT update listing by ID
app.put('/listings/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const result = await houseCollection.updateOne(
    { _id: ObjectId.createFromHexString(id) },
    { $set: updates }
  );

  res.json(result);
});

// DELETE listing by ID
app.delete('/listings/:id', async (req, res) => {
  const { id } = req.params;

  const result = await houseCollection.deleteOne({
    _id: ObjectId.createFromHexString(id),
  });

  res.json({ message: 'Listing deleted successfully' });
});

app.listen(PORT, () =>
  console.log('server is running 🏃 on http://localhost:3000')
);
