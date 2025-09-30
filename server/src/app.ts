import { createServer } from 'http';
import { MongoClient } from 'mongodb';

const client = new MongoClient(
  'mongodb+srv://beelwarad52_db_user:RkPaN0oZ21171o1R@cluster0.nkh2rau.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
);

const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

let db;
let houseCollection;

const initDb = async () => {
  await client.connect();
  db = client.db('listings');
  houseCollection = db.collection('homes');
};

const handleRequest = async (req, res) => {
  setCorsHeaders(res);
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('server is working on 3000');
  } else if (req.url == '/listings') {
    const listings = await houseCollection.find({}).toArray();
    console.log(listings);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(listings));
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('404 this route is invalid');
  }
};

const server = createServer(handleRequest);
await initDb();
server.listen(3000, () => console.log(`server is running 🏃`));
