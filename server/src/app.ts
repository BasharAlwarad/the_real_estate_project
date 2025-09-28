import { createServer, IncomingMessage, ServerResponse } from 'http';
import { MongoClient, Db, Collection } from 'mongodb';

// Types and Interfaces
interface HouseListing {
  _id?: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description?: string;
  imageUrl?: string;
  createdAt?: Date;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

interface ServerConfig {
  mongoUrl: string;
  dbName: string;
  collectionName: string;
  port: number;
}

// Configuration
const config: ServerConfig = {
  mongoUrl:
    'mongodb+srv://beelwarad52_db_user:SwCCDuyiIvMGr8eO@cluster0.ikvmhtu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  dbName: 'houseListings',
  collectionName: 'houses',
  port: 3000,
};

// Database client instance
const client: MongoClient = new MongoClient(config.mongoUrl);

// Database and collection references
let db: Db;
let houseCollection: Collection<HouseListing>;

// CORS headers setup
const setCorsHeaders = (res: ServerResponse): void => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// Error response helper
const sendErrorResponse = (
  res: ServerResponse,
  statusCode: number,
  error: string,
  details?: string
): void => {
  const errorResponse: ErrorResponse = { error, details };
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(errorResponse));
};

// Success response helper
const sendSuccessResponse = (res: ServerResponse, data: any): void => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

// Initialize database connection
const initializeDatabase = async (): Promise<void> => {
  try {
    await client.connect();
    db = client.db(config.dbName);
    houseCollection = db.collection<HouseListing>(config.collectionName);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

// Request handler
const handleRequest = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  setCorsHeaders(res);

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    switch (req.url) {
      case '/':
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Welcome to Real Estate Server');
        break;

      case '/listings':
        if (req.method === 'GET') {
          const listings: HouseListing[] = await houseCollection
            .find({})
            .toArray();
          sendSuccessResponse(res, listings);
        } else {
          sendErrorResponse(res, 405, 'Method not allowed');
        }
        break;

      default:
        sendErrorResponse(res, 404, 'Not found');
    }
  } catch (error) {
    console.error('Request handling error:', error);
    sendErrorResponse(
      res,
      500,
      'Internal server error',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

// Create and configure server
const server = createServer(handleRequest);

// Start server
const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();

    server.listen(config.port, () => {
      console.log(`🚀 Server running at http://localhost:${config.port}/`);
      console.log(`📊 Connected to database: ${config.dbName}`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down server...');
      await client.close();
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer().catch(console.error);
