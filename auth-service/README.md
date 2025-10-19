# Authentication Microservice

Dedicated microservice for handling all authentication operations for the Real Estate Project.

## Features

- 🔐 User login and signup
- 🔑 JWT token generation (access + refresh tokens)
- 🔄 Automatic token refresh
- 👤 User session management
- ✅ Token verification API
- 🍪 Secure httpOnly cookie-based authentication

## Setup

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env.development.local` file:

```env
PORT=4000
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/real_estate_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
CORS_ORIGIN=http://localhost:5173
```

⚠️ **Important**: The `JWT_SECRET` must be the same in both auth-service and main server!

### Run Development Server

```bash
npm run dev
```

Server will start on http://localhost:4000

## API Endpoints

### Public Endpoints

#### POST /auth/login

Login with email and password.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "user": {
    "_id": "...",
    "userName": "John Doe",
    "email": "user@example.com",
    "image": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Sets cookies: `accessToken` (15 min) and `refreshToken` (7 days)

#### POST /auth/signup

Create a new user account.

**Request:**

```json
{
  "userName": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "image": "optional-url"
}
```

#### POST /auth/refresh

Refresh access token using refresh token.

**Response:**

```json
{
  "message": "Token refreshed successfully"
}
```

Sets new `accessToken` cookie.

#### POST /auth/logout

Logout and clear tokens.

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

### Protected Endpoints (Require accessToken cookie)

#### GET /auth/me

Get current user information.

**Response:**

```json
{
  "user": {
    "_id": "...",
    "userName": "John Doe",
    "email": "user@example.com",
    "image": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Service Endpoints

#### POST /auth/verify-token

Verify if a token is valid (for inter-service communication).

**Headers:**

```
Authorization: Bearer <token>
```

Or send `accessToken` cookie.

**Response:**

```json
{
  "valid": true,
  "userId": "...",
  "user": { ... }
}
```

## Architecture

This microservice handles:

- User authentication (login/signup)
- Token lifecycle (generation, refresh, revocation)
- User identity verification

The main server handles:

- Business logic (users, listings)
- Protected routes (uses shared JWT secret for verification)

## Database

Uses MongoDB with two collections:

- `users` - User accounts (shared with main server)
- `refreshtokens` - Refresh token storage (exclusive to auth service)

## Security

- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ Refresh tokens hashed before database storage
- ✅ httpOnly cookies prevent XSS attacks
- ✅ Short-lived access tokens (15 minutes)
- ✅ Long-lived refresh tokens (7 days)
- ✅ Token revocation on logout

## Development

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Testing

Test with curl:

```bash
# Signup
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"userName":"Test User","email":"test@test.com","password":"password123"}' \
  -c cookies.txt

# Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}' \
  -c cookies.txt

# Get current user
curl http://localhost:4000/auth/me -b cookies.txt

# Logout
curl -X POST http://localhost:4000/auth/logout -b cookies.txt
```

## Integration

Client applications should:

1. Point auth requests to `http://localhost:4000/auth/*`
2. Point other requests to main server `http://localhost:3000/*`
3. Include credentials (cookies) with all requests

Example (axios):

```typescript
const authApi = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true,
});

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});
```
