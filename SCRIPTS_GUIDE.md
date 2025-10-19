# 🚀 Quick Start Scripts Guide

## 📦 Installation

After cloning the project, run ONE command to install all dependencies:

```bash
npm run installall
```

This will automatically install dependencies for:

1. Root project
2. Auth service
3. Main server
4. Client

**What it does:**

```bash
npm install                    # Root dependencies (concurrently)
cd auth-service && npm install # Auth service dependencies
cd server && npm install       # Server dependencies
cd client && npm install       # Client dependencies
```

---

## 🏃 Development

### Start All Services at Once (Recommended)

```bash
npm run dev
```

This starts ALL three services simultaneously:

- ✅ Auth Service (Port 4000)
- ✅ Main Server (Port 3000)
- ✅ Client (Port 5173)

**Output will look like:**

```
[dev:auth]   ⏩⏩⏩ Auth Service is running 🔐 on http://localhost:4000
[dev:server] ⏩⏩⏩ Server is running 🏃 on http://localhost:3000
[dev:client] ➜  Local:   http://localhost:5173/
```

**Features:**

- All services run in one terminal
- Color-coded output (each service has different color)
- If any service crashes, all services stop (--kill-others-on-fail)
- Press `Ctrl+C` once to stop all services

### Start Services Individually

If you need to run services separately:

```bash
# Auth service only
npm run dev:auth

# Main server only
npm run dev:server

# Client only
npm run dev:client
```

---

## 🏗️ Production Build

### Build All Services

```bash
npm run build
```

Compiles TypeScript to JavaScript for all services:

- Auth service → `auth-service/dist/`
- Main server → `server/dist/`
- Client → `client/dist/`

### Build Individual Services

```bash
npm run build:auth    # Build auth service only
npm run build:server  # Build server only
npm run build:client  # Build client only
```

---

## 🚦 Production Start

### Start Backend Services (Production)

```bash
npm start
```

Starts both backend services in production mode:

- Auth service (compiled JavaScript)
- Main server (compiled JavaScript)

**Note:** Client needs separate hosting (Vercel, Netlify, etc.)

### Start Individual Services (Production)

```bash
npm run start:auth    # Start auth service (production)
npm run start:server  # Start server (production)
```

---

## 📋 Available Scripts Summary

| Command                | Description              | Use Case              |
| ---------------------- | ------------------------ | --------------------- |
| `npm run installall`   | Install all dependencies | After cloning project |
| `npm run dev`          | Start all services (dev) | Local development     |
| `npm run dev:auth`     | Start auth service only  | Debug auth issues     |
| `npm run dev:server`   | Start server only        | Debug server issues   |
| `npm run dev:client`   | Start client only        | Frontend development  |
| `npm run build`        | Build all services       | Before deployment     |
| `npm run build:auth`   | Build auth service       | Deploy auth service   |
| `npm run build:server` | Build server             | Deploy server         |
| `npm run build:client` | Build client             | Deploy frontend       |
| `npm start`            | Start backends (prod)    | Production mode       |
| `npm run start:auth`   | Start auth (prod)        | Production auth       |
| `npm run start:server` | Start server (prod)      | Production server     |

---

## 🔧 Workflow Examples

### First Time Setup

```bash
# 1. Clone the repository
git clone https://github.com/YourUsername/the_real_estate_project.git
cd the_real_estate_project

# 2. Install all dependencies
npm run installall

# 3. Configure environment variables
# Copy .env.example files and update values in:
# - auth-service/.env.development.local
# - server/.env.development.local
# - client/.env

# 4. Start development
npm run dev
```

### Daily Development

```bash
# Start all services
npm run dev

# Open browser to http://localhost:5173
# Auth service running on http://localhost:4000
# Main server running on http://localhost:3000

# Make changes to code
# Services auto-reload on file changes (nodemon/vite)

# Stop all services
# Press Ctrl+C
```

### Production Deployment

```bash
# 1. Build all services
npm run build

# 2. Deploy each service
# Auth service: auth-service/dist/
# Main server: server/dist/
# Client: client/dist/

# 3. Start production servers
npm start  # Starts auth + server
```

---

## 🎯 What is `concurrently`?

**Concurrently** is a tool that runs multiple commands in parallel in a single terminal.

**Without concurrently** (3 terminals needed):

```bash
# Terminal 1
cd auth-service && npm run dev

# Terminal 2
cd server && npm run dev

# Terminal 3
cd client && npm run dev
```

**With concurrently** (1 terminal):

```bash
npm run dev
```

**Benefits:**

- ✅ Single command to start everything
- ✅ Color-coded output per service
- ✅ Stop all with one Ctrl+C
- ✅ Auto-restart on failures (--kill-others-on-fail)
- ✅ Perfect for development

---

## 🐛 Troubleshooting

### Issue: `npm run installall` fails

**Solution:**
Make sure you're in the project root:

```bash
pwd  # Should show: /path/to/the_real_estate_project
npm run installall
```

### Issue: Port already in use

**Check which ports are used:**

```bash
# Windows
netstat -ano | findstr :4000
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Kill process
taskkill /PID <PID> /F
```

### Issue: One service crashes, others stop

**Expected behavior** with `--kill-others-on-fail`:

- If auth service crashes → all services stop
- If server crashes → all services stop
- If client crashes → all services stop

**To prevent this:**
Remove `--kill-others-on-fail` from package.json:

```json
"dev": "concurrently \"npm run dev:auth\" \"npm run dev:server\" \"npm run dev:client\""
```

### Issue: Can't see which service logged what

**Solution:**
Concurrently adds prefixes automatically:

```
[dev:auth]   Log from auth service
[dev:server] Log from server
[dev:client] Log from client
```

Look for the prefix in square brackets!

---

## 💡 Pro Tips

### 1. Start Only Backend Services

```bash
concurrently "npm run dev:auth" "npm run dev:server"
```

### 2. Custom Colors

Edit package.json to add custom colors:

```json
"dev": "concurrently --kill-others-on-fail -c \"blue,green,yellow\" \"npm run dev:auth\" \"npm run dev:server\" \"npm run dev:client\""
```

### 3. Add Names to Output

```json
"dev": "concurrently -n AUTH,SERVER,CLIENT \"npm run dev:auth\" \"npm run dev:server\" \"npm run dev:client\""
```

Output:

```
[AUTH]   ⏩⏩⏩ Auth Service is running 🔐
[SERVER] ⏩⏩⏩ Server is running 🏃
[CLIENT] ➜  Local:   http://localhost:5173/
```

### 4. Silent Root Dependencies

If you only want to install service dependencies:

```json
"installall": "cd auth-service && npm install && cd ../server && npm install && cd ../client && npm install"
```

---

## 📚 Additional Resources

- [Concurrently Documentation](https://github.com/open-cli-tools/concurrently)
- [npm Scripts Documentation](https://docs.npmjs.com/cli/v9/using-npm/scripts)
- [Nodemon Documentation](https://nodemon.io/)

---

**Happy Coding! 🚀**
