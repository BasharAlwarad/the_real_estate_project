import http from 'http';
import url from 'url';

const PORT = process.env.PORT || 3000;

// CORS headers helper
const setCorsHeaders = (res: http.ServerResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// JSON response helper
const sendJson = (res: http.ServerResponse, statusCode: number, data: any) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

// Parse JSON body helper
const parseJsonBody = (req: http.IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
};

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Set CORS headers for all requests
  setCorsHeaders(res);

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url || '', true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  try {
    // Default route
    if (pathname === '/' && method === 'GET') {
      sendJson(res, 200, {
        message: 'Welcome to the Real Estate API',
        status: 'Server is running successfully',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Route not found
    sendJson(res, 404, {
      error: 'Route not found',
      path: pathname,
      method: method,
    });
  } catch (error) {
    console.error('Server error:', error);
    sendJson(res, 500, {
      error: 'Internal server error',
    });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`server is running 🏃‍➡️ : http://localhost:${PORT}`);
});
