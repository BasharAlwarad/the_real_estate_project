# Real Estate Server

Node.js TypeScript backend API for the Real Estate application.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎯 Features

- Express.js server with TypeScript
- CORS enabled for cross-origin requests
- RESTful API endpoints
- Sample property data
- Development server with auto-reload

## 📊 API Endpoints

- `GET /` - Health check endpoint
- `GET /api/properties` - Get all properties

## 🔧 Environment

- **Development**: http://localhost:5000
- **Port**: 5000 (configurable via PORT environment variable)

## 📁 Project Structure

```
src/
├── index.ts         # Main Express server
├── ...              # Additional modules (as needed)
dist/                # Compiled JavaScript output
tsconfig.json        # TypeScript configuration
```

## 🛠️ Development

The server uses nodemon for automatic reloading during development. Any changes to `.ts` files will automatically restart the server.

## 🌐 CORS Configuration

CORS is enabled to allow the React frontend (running on port 3000) to communicate with this API server.