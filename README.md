# Real Estate Project - Microservices Architecture

## �️ Architecture Overview

This project demonstrates **microservices architecture** with separate authentication service and main application server.

### **Services**

1. **Auth Service** (Port 4000) - Handles all authentication operations
2. **Main Server** (Port 3000) - Handles business logic (users, listings)
3. **Client** (Port 5173) - React frontend application

---

## 🎯 What You'll Learn

- **Microservices architecture** - Separating concerns into dedicated services
- **JWT authentication with refresh tokens** - Professional auth pattern
- **Service-to-service communication** - How microservices interact
- **Shared JWT verification** - Stateless authentication across services
- **httpOnly cookies** - Secure token storage

---

## 🔑 The Two-Token System

### **Access Token** (Short-lived: 15 minutes)

- Used for **every API request**
- Contains user information (userId)
- **Expires quickly** for security
- Stored as **httpOnly cookie**

### **Refresh Token** (Long-lived: 7 days)

- Used to **get new access tokens**
- **Hashed in database** for security
- Allows users to **stay logged in**
- Also stored as **httpOnly cookie**

---

## 🚀 Quick Start

### **Option 1: Run All Services at Once** (Recommended)

```bash
# First time setup - install all dependencies
npm run installall

# Start all services (auth-service, server, client)
npm run dev
```

### **Option 2: Run Services Individually**

```bash
# Terminal 1: Start Auth Service
cd auth-service
npm install
npm run dev

# Terminal 2: Start Main Server
cd server
npm run dev

# Terminal 3: Start Client
cd client
npm run dev
```

**Access Points:**

- Auth Service: http://localhost:4000
- Main Server: http://localhost:3000
- Client: http://localhost:5173

> 💡 **Tip:** See [SCRIPTS_GUIDE.md](./SCRIPTS_GUIDE.md) for all available commands and detailed usage

---

## 📖 How It Works

### **Step 1: User Logs In**

```typescript
// POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**What happens:**

1. Server verifies password
2. Creates **access token** (15 min)
3. Creates **refresh token** (7 days)
4. Hashes refresh token with bcrypt
5. Saves hashed token to database
6. Sends **both tokens as cookies**

### **Step 2: User Makes Requests**

```typescript
// GET /users/me
// Cookies sent automatically by browser
```

**What happens:**

1. Middleware reads **accessToken** from cookie
2. Verifies JWT is valid
3. Extracts userId from token
4. Request continues ✅

### **Step 3: Access Token Expires**

After 15 minutes, access token expires.

**What happens:**

1. User makes request
2. Server returns **401 Unauthorized**
3. Client **automatically** calls `/auth/refresh`
4. Server verifies refresh token
5. Issues **new access token**
6. Client **retries original request**
7. User never notices! ✨

### **Step 4: User Logs Out**

```typescript
// POST /auth/logout
```

**What happens:**

1. Server finds refresh token in database
2. Deletes it from database
3. Clears both cookies
4. User is logged out ✅

---

## 📁 Key Files Explained

### **Backend**

| File                                        | Purpose                                |
| ------------------------------------------- | -------------------------------------- |
| `server/src/controllers/AuthControllers.ts` | Login, refresh, logout logic           |
| `server/src/middlewares/auth.ts`            | Protects routes, verifies access token |
| `server/src/models/RefreshToken.ts`         | Database model for refresh tokens      |
| `server/src/routes/AuthRoutes.ts`           | Auth endpoints                         |

### **Frontend**

| File                            | Purpose                                |
| ------------------------------- | -------------------------------------- |
| `client/src/utils/api.ts`       | **Auto-refresh interceptor**           |
| `client/src/pages/Login.tsx`    | Login form                             |
| `client/src/components/Nav.tsx` | Shows login/logout based on auth state |

---

## 🔍 Code Walkthrough

### **1. Login Flow** (`AuthControllers.ts`)

```typescript
export const login = async (req: Request, res: Response) => {
  // 1. Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  // 2. Create tokens
  const accessToken = jwt.sign({ userId }, secret, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, secret, { expiresIn: '7d' });

  // 3. Hash and save refresh token
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  await RefreshToken.create({ userId, token: hashedRefreshToken, expiresAt });

  // 4. Send as cookies
  res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 15min });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7days });

  // 5. Return user info
  res.json({ user });
};
```

### **2. Auth Middleware** (`auth.ts`)

```typescript
export const requireAuth = (req, res, next) => {
  // 1. Read access token from cookie
  const token = req.cookies?.accessToken;

  // 2. Verify it's valid
  const payload = jwt.verify(token, secret);

  // 3. Attach userId to request
  req.userId = payload.userId;

  // 4. Continue
  next();
};
```

### **3. Refresh Endpoint** (`AuthControllers.ts`)

```typescript
export const refresh = async (req: Request, res: Response) => {
  // 1. Get refresh token from cookie
  const refreshToken = req.cookies?.refreshToken;

  // 2. Verify JWT
  const payload = jwt.verify(refreshToken, secret);

  // 3. Find in database (compare with bcrypt)
  const tokenDocs = await RefreshToken.find({ userId: payload.userId });
  let validToken = null;
  for (const doc of tokenDocs) {
    if (await bcrypt.compare(refreshToken, doc.token)) {
      validToken = doc;
      break;
    }
  }

  // 4. Check if expired
  if (validToken.expiresAt < new Date()) {
    return res.status(401).json({ message: 'Expired' });
  }

  // 5. Create NEW access token
  const newAccessToken = jwt.sign({ userId }, secret, { expiresIn: '15m' });

  // 6. Send as cookie
  res.cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: 15min });

  res.json({ message: 'Token refreshed' });
};
```

### **4. Auto-Refresh Interceptor** (`api.ts`)

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If 401 error and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        await api.post('/auth/refresh');

        // Retry original request with new access token
        return api.request(originalRequest);
      } catch {
        // Refresh failed - redirect to login
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 🔒 Security Features

### **1. httpOnly Cookies**

- JavaScript **cannot access** the tokens
- Protects against **XSS attacks**

### **2. Hashed Refresh Tokens**

- Stored with **bcrypt** in database
- If database is hacked, tokens are **useless**

### **3. Short-lived Access Tokens**

- Expire after **15 minutes**
- Limits damage if stolen

### **4. Database Storage**

- Can **revoke** refresh tokens anytime
- Logout **actually works**

---

## 🎯 Testing the Flow

### **1. Test Login**

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}' \
  -c cookies.txt

# Check cookies
cat cookies.txt
# You'll see: accessToken and refreshToken
```

### **2. Test Protected Route**

```bash
# Use access token
curl http://localhost:3000/users/me -b cookies.txt

# Response: User data ✅
```

### **3. Test Auto-Refresh**

```bash
# Wait 15 minutes (or change maxAge to 10 seconds for testing)
# Make request again
curl http://localhost:3000/users/me -b cookies.txt

# First attempt: 401
# Auto-refresh happens
# Retry: 200 ✅
```

### **4. Test Logout**

```bash
curl -X POST http://localhost:3000/auth/logout -b cookies.txt

# Cookies cleared
# Token deleted from database
```

---

## 💡 Learning Exercises

### **Beginner**

1. Add console.logs to trace the entire login flow
2. Change token expiry times and observe behavior
3. Add a "remember me" checkbox (longer refresh token)

### **Intermediate**

4. Add refresh token rotation (new refresh token on each refresh)
5. Implement "logout all devices" (delete all user tokens)
6. Add token metadata (IP, device, last used)

### **Advanced**

7. Implement token reuse detection
8. Add multi-tab coordination with BroadcastChannel
9. Create an admin panel to view active sessions

---

## 📚 Additional Resources

- [JWT.io](https://jwt.io/) - Decode and verify JWTs
- [OWASP Auth Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) - Security best practices
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Password hashing library

---

## 🎓 Next Steps

1. ✅ Read through `AuthControllers.ts` - understand each step
2. ✅ Test login/logout flow in the browser
3. ✅ Examine the auto-refresh interceptor in `api.ts`
4. ✅ Try the exercises above to deepen understanding
