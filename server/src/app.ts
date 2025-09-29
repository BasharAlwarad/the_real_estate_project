import { createServer } from 'http';
import { MongoClient } from 'mongodb';

// Configuration
const mongoUrl = process.env.MONGO_URL;
const port = process.env.PORT;
const dbName = 'houseListings';
const collectionName = 'houses';

// Database client instance
const client = new MongoClient(mongoUrl);

// Database and collection references
let db;
let houseCollection;

// CORS headers setup
const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// Initialize database connection
const initDB = async () => {
  await client.connect();
  db = client.db(dbName);
  houseCollection = db.collection(collectionName);
  console.log('Connected to MongoDB');
};

// Request handler
const handleRequest = async (req, res) => {
  // Add CORS headers
  setCorsHeaders(res);

  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Real Estate Server');
  } else if (req.url === '/listings') {
    const listings = await houseCollection.find({}).toArray();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(listings));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
};

// Create server
const server = createServer(handleRequest);

// Start everything
await initDB();
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
