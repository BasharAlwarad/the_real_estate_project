# Real Estate Project

A full-stack real estate application built with React TypeScript for the frontend and Node.js TypeScript for the backend. This project is designed as teaching material to demonstrate modern web development practices.

## 🏗️ Project Structure

```
the_real_estate_project/
├── client/                 # React TypeScript Frontend
│   ├── src/
│   │   ├── App.tsx        # Main React component
│   │   ├── App.css        # Styling
│   │   └── ...            # Other React files
│   ├── package.json
│   └── tsconfig.json
├── server/                 # Node.js TypeScript Backend
│   ├── src/
│   │   └── index.ts       # Express server
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BasharAlwarad/the_real_estate_project.git
cd the_real_estate_project
```

2. Install dependencies for both client and server:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Running the Application

#### Development Mode

1. **Start the backend server:**
```bash
cd server
npm run dev
```
The server will run on http://localhost:5000

2. **Start the frontend client (in a new terminal):**
```bash
cd client
npm start
```
The client will run on http://localhost:3000

#### Production Mode

1. **Build and start the server:**
```bash
cd server
npm run build
npm start
```

2. **Build the client:**
```bash
cd client
npm run build
```

## 🎯 Features

### Frontend (React TypeScript)
- ⚛️ React 19 with TypeScript
- 🎨 Modern responsive design
- 🏠 Property listing display
- 📱 Mobile-friendly interface
- 🔄 API integration with backend

### Backend (Node.js TypeScript)
- 🚀 Express.js server
- 🔒 CORS enabled for cross-origin requests
- 📊 RESTful API endpoints
- 🏠 Sample property data
- ⚡ TypeScript for type safety

## 📚 API Endpoints

- `GET /` - Health check endpoint
- `GET /api/properties` - Get all properties

## 🛠️ Available Scripts

### Client Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Server Scripts
- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

## 📖 Learning Objectives

This project demonstrates:
- ✅ Full-stack TypeScript development
- ✅ React functional components with hooks
- ✅ Express.js API development
- ✅ CORS configuration
- ✅ RESTful API design
- ✅ Modern project structure
- ✅ Package management with npm

## 🤝 Contributing

This is a teaching project. Feel free to fork and experiment with additional features!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Bashar Alwarad**

---

*This project is created for educational purposes to teach modern full-stack web development with TypeScript.*