# Authentication & Authorization with Cookies + JWT# Real Estate Project - Clean Documented Code with Swagger/OpenAPI

**A Complete Lecture on Implementing Secure Authentication**## 🎯 Why Documentation Matters

This README is a comprehensive guide explaining how authentication and authorization work in this project using **HTTP-only cookies** and **JSON Web Tokens (JWT)**. It covers fundamental concepts, implementation details with real code from this repository, security best practices, and step-by-step instructions.### The Problem: Undocumented Code

---

// ❌ What does this endpoint do? What does it expect? What does it return?

## 📚 Table of Contentsapp.post('/users', (req, res) => {

// Mystery function - good luck figuring it out!

1. [What is Authentication & Authorization?](#what-is-authentication--authorization)});

2. [Core Concepts](#core-concepts)```

   - [What is JWT?](#what-is-jwt)

   - [What is bcrypt?](#what-is-bcrypt)### The Solution: Clean Documented Code

   - [What are Cookies?](#what-are-cookies)

3. [HTTP Request/Response Flow](#http-requestresponse-flow)```typescript

4. [Backend Implementation](#backend-implementation)// ✅ Clear, self-documenting code with proper API documentation

   - [Login Controller](#login-controller)/\*\*

   - [Logout Controller](#logout-controller) \* Creates a new user account

   - [GetMe Controller](#getme-controller) \* @route POST /users

   - [requireAuth Middleware](#requireauth-middleware) \* @param {UserCreateRequest} req.body - User registration data

5. [Frontend Implementation](#frontend-implementation) \* @returns {UserResponse} 201 - User created successfully

   - [Axios Configuration](#axios-configuration) \* @returns {ErrorResponse} 400 - Validation error

   - [Checking Authentication Status](#checking-authentication-status) \*/

6. [Security Considerations](#security-considerations)export const createUser = async (req: Request, res: Response) => {

7. [Common Pitfalls & Troubleshooting](#common-pitfalls--troubleshooting) // Clean, readable implementation

8. [Testing Locally](#testing-locally)};

---

## 📚 Learning Objectives

## What is Authentication & Authorization?

By exploring this branch, you'll understand:

**Authentication** answers the question: _"Who are you?"_

- Verifying a user's identity (usually with email + password)### **🔍 Core Concepts**

- Proving that the user is who they claim to be

- **Why documentation is critical** for professional development

**Authorization** answers the question: _"What are you allowed to do?"_- **The cost of poor documentation** on team productivity

- Determining what resources or actions an authenticated user can access- **What is Swagger/OpenAPI** and why it's industry standard

- Enforcing permissions and access control- **The difference between YAML and JSON** for configuration

- **Clean code principles** for maintainable projects

### Why Cookies + JWT?

### **🛠️ Practical Implementation**

This project uses a **cookie-based JWT approach**:

- **JWT (JSON Web Token)**: A compact, self-contained token that carries user identity- **How to implement Swagger** in a TypeScript Express server

- **HTTP-only Cookies**: Secure storage mechanism that JavaScript cannot access- **How to organize documentation** separately from code

- **Why this combination?**- **How to create reusable schema components**

  - Protects against XSS (Cross-Site Scripting) attacks- **How to generate interactive API documentation**

  - Automatic cookie sending by browser (no manual header management)- **How to maintain documentation** alongside code changes

  - Stateless authentication (server doesn't need to store sessions)

---

---

## 🚀 Quick Start

## Core Concepts

### 1. Explore the Documentation

### What is JWT?

`````bash

**JSON Web Token (JWT)** is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object.# Start the server

cd server

#### Structure of a JWT      description: 'Professional API with clean documentation',

    },

A JWT consists of three parts separated by dots (`.`):  },

  apis: [

```    './src/schemas/*.ts', // Zod validation schemas

header.payload.signature    './src/docs/*.yaml', // Separated documentation

```  ],

};

**Example:**

```const swaggerSpec = swaggerJSDoc(options);

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGYwYjJkMmU5YiIsImlhdCI6MTY5NzQwMDAwMCwiZXhwIjoxNjk4MDA0ODAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5crouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


**Decoded JWT:**#### **Step 3: Create Separated Documentation**

1. **Header** (algorithm and token type):```yaml

````json# server/src/docs/users.yaml

{openapi: 3.1.0

  "alg": "HS256",paths:

  "typ": "JWT"  /users:

}    get:

```      tags: [Users]

      summary: Get all users

2. **Payload** (claims/data):      description: Retrieve all users from the database

```json      responses:

{        200:

  "userId": "64f0b2d2e9b...",          description: Successfully retrieved users

  "iat": 1697400000,          content:

  "exp": 1698004800            application/json:

}              schema:

```                type: array

                items:

3. **Signature** (verification):                  $ref: '#/components/schemas/User'


HMACSHA256(

base64UrlEncode(header) + "." + base64UrlEncode(payload),#### **Step 4: Clean Controllers**

secret

)```typescript

````// server/src/controllers/UsersControllers.ts

import { User } from '#models';

#### Why JWT?import { httpErrors } from '#utils';



✅ **Stateless** - Server doesn't need to store session data  // 📝 API documentation: src/docs/users.yaml

✅ **Self-contained** - All user info is in the token

✅ **Scalable** - Works across multiple servers  export const getAllUsers = async (req: Request, res: Response) => {

✅ **Secure** - Cryptographically signed to prevent tampering    const users = await User.find({});

  res.json(users);

⚠️ **Important**: JWT is **encoded**, not **encrypted** (anyone can decode and read it). Never put sensitive data in JWT!};



---export const createUser = async (req: Request, res: Response) => {

  const newUser = new User(req.body);

### What is bcrypt?  const savedUser = await newUser.save();

  res.status(201).json({

**bcrypt** is a password hashing function designed specifically for securely storing passwords.    message: 'User created successfully',

    user: savedUser,

#### Why bcrypt?  });

};

- **One-way function**: You cannot reverse a bcrypt hash to get the original password```

- **Adaptive**: You can increase the "cost factor" to make it slower as computers get faster

- **Salt included**: Each password gets a unique random salt, preventing rainbow table attacks#### **Step 5: Maintain Schema Validation**



#### How it works:```typescript

// server/src/schemas/user.ts - Keep Zod schemas for validation

**Storing a password:**export const userCreateSchema = z.object({

```typescript  userName: z.string().min(2).max(50),

import bcrypt from 'bcrypt';  email: z.string().email(),

  password: z.string().min(6),

const plainPassword = 'mySecretPassword123';});

const hashedPassword = await bcrypt.hash(plainPassword, 10); // 10 is the salt rounds

// Result: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy// Documentation references these schemas automatically!

````

**Verifying a password:**---

````typescript

const isValid = await bcrypt.compare(plainPassword, hashedPassword);## 📖 Chapter 4: Advanced Organization Patterns

// Returns: true if password matches, false otherwise

```### Documentation Architecture



**Why NOT use MD5, SHA1, or plain hashing?**#### **Modular Documentation**

- ❌ Too fast (enables brute-force attacks)

- ❌ No built-in salt (vulnerable to rainbow tables)```yaml

- ❌ Not designed for passwords# main.yaml - Core API information

info:

---  title: Real Estate API

  version: 1.0.0

### What are Cookies?

# users.yaml - User-specific endpoints

**Cookies** are small pieces of data that the server sends to the browser, which the browser stores and sends back with every subsequent request to that domain.paths:

  /users: { /* user endpoints */ }

#### Cookie Attributes

# listings.yaml - Listing-specific endpoints

**httpOnly** - Cookie cannot be accessed via JavaScript (protects against XSS)paths:

```javascript  /listings: { /* listing endpoints */ }

// ❌ This will return empty string for httpOnly cookies```

console.log(document.cookie);

```#### **Reusable Components**



**Secure** - Cookie is only sent over HTTPS (protects against man-in-the-middle attacks)```yaml

# examples.ts - Shared examples and parameters

**SameSite** - Controls when cookies are sent in cross-site requestscomponents:

- `Strict`: Never sent in cross-site requests  parameters:

- `Lax`: Sent in top-level navigation (default, good for most apps)    UserIdParam:

- `None`: Always sent (requires `Secure` flag)      name: id

      in: path

**Max-Age / Expires** - When the cookie expires      required: true

      schema:

#### Example Set-Cookie Header        type: string

        format: objectid

````

Set-Cookie: token=eyJhbGc...; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Path=/ examples:

````UserExample:

      value:

#### Cookies vs localStorage vs sessionStorage        _id: '507f1f77bcf86cd799439011'

        userName: 'john_doe'

| Feature | Cookies (httpOnly) | localStorage | sessionStorage |        email: 'john@example.com'

|---------|-------------------|--------------|----------------|```

| Accessible by JS | ❌ No | ✅ Yes | ✅ Yes |

| Auto-sent to server | ✅ Yes | ❌ No | ❌ No |### Alternative Organization Methods

| XSS Protection | ✅ Protected | ❌ Vulnerable | ❌ Vulnerable |

| CSRF Risk | ⚠️ Yes (mitigated with SameSite) | ✅ No | ✅ No |#### **Method 1: External JSON Files**

| Storage Limit | ~4KB | ~5-10MB | ~5-10MB |

| Best for Auth? | ✅ Yes | ❌ No | ❌ No |```typescript

import openapi from './docs/openapi.json';

---const swaggerSpec = openapi;

````

## HTTP Request/Response Flow

#### **Method 2: TypeScript Configuration Objects**

### Complete Authentication Flow (Mermaid Diagram)

````typescript

```mermaid// docs/userEndpoints.ts

sequenceDiagramexport const userEndpoints = {

    participant Browser as Client (Browser)  '/users': {

    participant Server as Server (Express)    get: {

    participant DB as Database (MongoDB)      /* documentation */

    },

    Note over Browser,DB: 1. User Login Flow  },

    Browser->>Server: POST /auth/login {email, password}};

    Server->>DB: findOne({ email })```

    DB-->>Server: User document (with hashed password)

    Server->>Server: bcrypt.compare(password, hashedPassword)#### **Method 3: Decorator-Based (Advanced)**

    Server->>Server: jwt.sign({ userId }, secret, { expiresIn: '7d' })

    Server-->>Browser: Set-Cookie: token=<JWT>; HttpOnly; Secure; SameSite=Lax```typescript

    Server-->>Browser: 200 { user: {...} }@ApiTags('Users')

    Note over Browser: Cookie stored automatically@ApiResponse({ status: 200, description: 'Success' })

export class UsersController {

    Note over Browser,DB: 2. Accessing Protected Route  @Get()

    Browser->>Server: GET /users/me (Cookie: token=<JWT>)  @ApiOperation({ summary: 'Get all users' })

    Server->>Server: Read cookie, verify JWT signature  getAllUsers() {

    Server->>Server: jwt.verify(token, secret) → { userId }    /* implementation */

    Server->>DB: findById(userId)  }

    DB-->>Server: User document}

    Server-->>Browser: 200 { user: {...} }```



    Note over Browser,DB: 3. User Logout Flow---

    Browser->>Server: POST /auth/logout

    Server-->>Browser: Set-Cookie: token=; Max-Age=0## 🎯 Testing & Validation

    Server-->>Browser: 200 { message: 'Logged out' }

    Note over Browser: Cookie cleared### Interactive Testing

````

````bash

### Request/Response Headers# 1. Start the server

npm run dev

**Login Request:**

```http# 2. Open documentation

POST /auth/login HTTP/1.1open http://localhost:3000/docs

Host: localhost:3000

Content-Type: application/json# 3. Test endpoints directly in browser

# 4. See real-time validation

{# 5. Copy working code examples

  "email": "user@example.com",```

  "password": "myPassword123"

}### Documentation Quality Checklist

````

- ✅ **All endpoints documented** with examples

**Login Response:**- ✅ **Request/response schemas** clearly defined

````http- ✅ **Error responses** documented with codes

HTTP/1.1 200 OK- ✅ **Parameters** have descriptions and examples

Set-Cookie: token=eyJhbGc...; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Path=/- ✅ **Authentication** requirements specified

Content-Type: application/json- ✅ **Interactive testing** works for all endpoints



{---

  "user": {

    "_id": "64f0b2d2e9b...",## 🏆 Key Learning Outcomes

    "userName": "john_doe",

    "email": "user@example.com",### **Professional Skills Gained**

    "image": "...",

    "createdAt": "2025-10-01T10:00:00.000Z",1. **Clean Code Principles** - Separation of concerns

    "updatedAt": "2025-10-01T10:00:00.000Z"2. **Industry Standards** - OpenAPI/Swagger expertise

  }3. **Team Collaboration** - Self-documenting APIs

}4. **Maintenance Excellence** - Organized, scalable structure

```5. **Professional Portfolio** - Enterprise-grade documentation



**Subsequent Protected Request:**### **Before vs After Comparison**

```http

GET /users/me HTTP/1.1| Aspect              | Before            | After           | Benefit                    |

Host: localhost:3000| ------------------- | ----------------- | --------------- | -------------------------- |

Cookie: token=eyJhbGc...| **File Size**       | 320+ lines        | 70 lines        | **77% reduction**          |

```| **Readability**     | Mixed concerns    | Pure logic      | **Clean separation**       |

| **Maintenance**     | Hard to find code | Easy navigation | **Developer friendly**     |

---| **Documentation**   | Inline chaos      | Organized files | **Professional structure** |

| **Team Onboarding** | 2 weeks           | 2 days          | **90% faster**             |

## Backend Implementation

---

### Project Structure

## 📚 Additional Resources

````

server/src/### **Learning Materials**

├── controllers/

│ ├── AuthControllers.ts # login, logout, getMe- [OpenAPI Specification](https://swagger.io/specification/) - Official documentation

│ └── index.ts # exports all controllers- [YAML Tutorial](https://yaml.org/spec/1.2/spec.html) - Understanding YAML syntax

├── middlewares/- [Clean Code Principles](https://blog.cleancoder.com/) - Robert C. Martin's principles

│ ├── auth.ts # requireAuth middleware- [API Design Best Practices](https://restfulapi.net/) - REST API guidelines

│ └── index.ts

├── models/### **Tools & Extensions**

│ └── User.ts # User schema with bcrypt

└── routes/- [Swagger UI](https://swagger.io/tools/swagger-ui/) - Interactive documentation

    ├── AuthRoutes.ts            # /auth/login, /auth/logout- [Swagger Editor](https://editor.swagger.io/) - Online YAML editor

    └── UsersRoutes.ts           # /users/me (protected)- [VS Code Swagger Viewer](https://marketplace.visualstudio.com/items?itemName=Arjun.swagger-viewer) - Preview docs in VS Code

````- [Postman](https://www.postman.com/) - API testing (alternative to Swagger UI)



---### **Real-World Examples**



### Login Controller- [GitHub API](https://docs.github.com/en/rest) - Professional API documentation

- [Stripe API](https://stripe.com/docs/api) - Best-in-class developer experience

**File:** `server/src/controllers/AuthControllers.ts`- [Twitter API](https://developer.twitter.com/en/docs) - Comprehensive documentation



```typescript---

import { Request, Response } from 'express';

import { User } from '#models';## 🎓 Next Steps

import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';### **Immediate Actions**



export const login = async (req: Request, res: Response) => {1. ✅ **Explore the documentation** at `http://localhost:3000/docs`

  const { email, password } = req.body;2. ✅ **Compare file sizes** between main and this branch

  3. ✅ **Test API endpoints** using the interactive interface

  // 1. Validate input4. ✅ **Examine the organized structure** in `src/docs/`

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // 2. Find user by email
  const user = await User.findOne({ email });
  if (!user || !user.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // 3. Compare password with bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // 4. Create JWT
  const jwtSecret = process.env.JWT_SECRET || 'devsecret';
  const token = jwt.sign(
    { userId: user._id },           // Payload (minimal data)
    jwtSecret,                       // Secret key
    { expiresIn: '7d' }             // Token expires in 7 days
  );

  // 5. Set JWT as HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,                  // Cannot be accessed by JavaScript
    sameSite: 'lax',                 // CSRF protection
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  // 6. Return user info (excluding password)
  const { _id, userName, image, createdAt, updatedAt } = user;
  return res.json({
    user: { _id, userName, email, image, createdAt, updatedAt },
  });
};
````

**Key Points:**

- Never return the password in the response
- Always use `bcrypt.compare()` (never compare passwords directly)
- JWT payload should contain minimal data (just `userId`)
- Cookie flags are crucial for security

---

### Logout Controller

**File:** `server/src/controllers/AuthControllers.ts`

```typescript
export const logout = (req: Request, res: Response) => {
  // Clear the cookie by setting Max-Age to 0
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({ message: 'Logged out successfully' });
};
```

**Why this works:**

- `clearCookie()` sends a `Set-Cookie` header with `Max-Age=0`
- Browser immediately deletes the cookie
- Future requests won't include the token

---

### GetMe Controller

**File:** `server/src/controllers/AuthControllers.ts`

The `getMe` endpoint returns the currently authenticated user's profile. It's commonly used by frontends to:

- Display user info in navigation
- Check if user is logged in
- Populate user state on app load

```typescript
export const getMe = async (req: Request, res: Response) => {
  // userId was attached by requireAuth middleware
  const userId = (req as any).userId as string | undefined;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Find user and exclude password
  const user = await User.findById(userId).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({ user });
};
```

**Route:** `server/src/routes/UsersRoutes.ts`

```typescript
userRouter.get('/me', requireAuth, getMe);
```

---

### requireAuth Middleware

**File:** `server/src/middlewares/auth.ts`

This middleware protects routes by verifying the JWT from the cookie.

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 1. Extract token from cookie
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  try {
    // 2. Verify token signature and expiration
    const jwtSecret = process.env.JWT_SECRET || 'devsecret';
    const payload = jwt.verify(token, jwtSecret) as { userId: string };

    // 3. Attach userId to request for downstream controllers
    (req as any).userId = payload.userId;

    // 4. Continue to next middleware/controller
    next();
  } catch (error) {
    // Token is invalid or expired
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};
```

**What `jwt.verify()` checks:**

- ✅ Signature is valid (token hasn't been tampered with)
- ✅ Token hasn't expired
- ✅ Token was signed with the correct secret

**Usage:**

```typescript
// Protect a route
userRouter.put('/:id', requireAuth, updateUser);
userRouter.delete('/:id', requireAuth, deleteUser);
```

---

## Frontend Implementation

### Project Structure

```
client/src/
├── components/
│   └── Nav.tsx                  # Checks auth status, shows Login/Logout
├── pages/
│   ├── Login.tsx               # Login form
│   └── Signup.tsx              # Signup form
└── utils/
    ├── api.ts                  # Axios instance with credentials
    └── auth.ts                 # Helper functions for auth
```

---

### Axios Configuration

**File:** `client/src/utils/api.ts`

```typescript
import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 🔑 Critical: Send cookies with requests
});

// Automatically redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Prevent redirect loop
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Why `withCredentials: true`?**

- Tells axios to include cookies in requests
- Required for cookie-based authentication
- Must be set on both client AND server (CORS)

---

### Checking Authentication Status

**File:** `client/src/components/Nav.tsx`

```typescript
import { NavLink } from 'react-router-dom';
import api from '../utils/api';
import React, { useState, useEffect } from 'react';

const Nav: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Call /users/me to check if user is logged in
        const res = await api.get('/users/me');
        setIsAuthenticated(res.status === 200 && !!res.data.user);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore errors
    } finally {
      window.location.href = '/';
    }
  };

  return (
    <nav>
      {loading ? null : isAuthenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/signup">Signup</NavLink>
        </>
      )}
    </nav>
  );
};

export default Nav;
```

**Alternative: Using fetch**

**File:** `client/src/utils/auth.ts`

```typescript
interface User {
  _id: string;
  userName: string;
  email: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getUser = async (): Promise<User | null> => {
  try {
    const res = await fetch('/users/me', {
      credentials: 'include', // 🔑 Send cookies with fetch
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
};
```

---

## Security Considerations

### ✅ Best Practices Implemented

1. **HTTP-only Cookies**

   - Protects against XSS attacks
   - JavaScript cannot read the token

2. **bcrypt for Passwords**

   - Industry-standard password hashing
   - Built-in salt generation
   - Adaptive cost factor

3. **JWT Expiration**

   - Tokens expire after 7 days
   - Limits damage if token is compromised

4. **SameSite Cookie Attribute**

   - Protects against CSRF attacks
   - `Lax` is good for most applications

5. **Secure Flag in Production**

   - Cookies only sent over HTTPS
   - Prevents man-in-the-middle attacks

6. **Minimal JWT Payload**
   - Only stores `userId`
   - Reduces data exposure

### ⚠️ Additional Considerations

**1. Use Strong JWT_SECRET**

```bash
# Generate a strong secret (32+ characters)
openssl rand -base64 32
```

**2. Consider Refresh Tokens**
For better security, implement refresh token rotation:

- Short-lived access token (15 minutes)
- Long-lived refresh token (7 days)
- Refresh token stored in database, can be revoked

**3. CSRF Protection**
If your app accepts requests from other domains, add CSRF tokens:

```typescript
// Example: Double Submit Cookie pattern
// (Beyond scope of this lecture)
```

**4. Rate Limiting**
Prevent brute-force attacks on login:

```typescript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
});

app.post('/auth/login', loginLimiter, login);
```

**5. HTTPS in Production**
Always use HTTPS in production to protect cookies in transit.

**6. Password Requirements**
Enforce strong passwords:

- Minimum length (8+ characters)
- Complexity requirements
- Check against common passwords

---

## Common Pitfalls & Troubleshooting

### 1. "Invalid user ID" errors in server logs

**Symptoms:** Server logs show `GET /users/me - Error: Invalid user ID`

**Causes:**

- Cookie not being sent by browser
- JWT verification failing
- Middleware not attaching `userId`

**Solutions:**

```typescript
// Check if cookie exists
console.log('Cookie:', req.cookies);

// Check JWT payload
const payload = jwt.verify(token, jwtSecret);
console.log('Payload:', payload);

// Ensure cookie-parser middleware is installed
import cookieParser from 'cookie-parser';
app.use(cookieParser());
```

### 2. Cookie not sent with requests

**Symptoms:** `req.cookies.token` is `undefined`

**Solutions:**

- Frontend: Ensure `withCredentials: true` in axios or `credentials: 'include'` in fetch
- Backend: Configure CORS properly:

  ```typescript
  import cors from 'cors';

  app.use(
    cors({
      origin: 'http://localhost:5173', // Your frontend URL
      credentials: true,
    })
  );
  ```

### 3. 401 Redirect Loop

**Symptoms:** App keeps redirecting to `/login` even after logging in

**Solutions:**

```typescript
// Don't redirect if already on login page
if (error.response?.status === 401) {
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}
```

### 4. Cookie not set after login

**Symptoms:** Login succeeds but cookie doesn't appear in browser

**Solutions:**

- Check `Set-Cookie` header in Network tab
- Ensure cookie flags match environment:
  ```typescript
  secure: process.env.NODE_ENV === 'production';
  // In dev (HTTP), secure must be false
  ```

---

## Testing Locally

### 1. Start the Server

```bash
cd server
npm install
npm run dev
```

Server should start on `http://localhost:3000`

### 2. Start the Client

```bash
cd client
npm install
npm run dev
```

Client should start on `http://localhost:5173` (or similar)

### 3. Test the Flow

**Step 1: Sign Up**

- Navigate to `/signup`
- Create a new account
- Password will be hashed with bcrypt

**Step 2: Login**

- Navigate to `/login`
- Enter credentials
- Open DevTools → Network tab
- Check Response Headers for `Set-Cookie: token=...`

**Step 3: Verify Cookie**

- DevTools → Application tab → Cookies
- Check that `token` cookie exists with:
  - `HttpOnly`: ✓
  - `Secure`: ✓ (if HTTPS)
  - `SameSite`: Lax

**Step 4: Test Protected Route**

- Navigate to any page
- Check Network tab for `/users/me` request
- Verify cookie is sent in Request Headers: `Cookie: token=...`

**Step 5: Logout**

- Click Logout button
- Check that cookie is removed
- Verify redirect to home/login

### 4. Debugging Tips

**Decode JWT (for debugging only):**

```javascript
// In browser console or jwt.io
const token = 'eyJhbGc...';
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);
```

**Check Token Expiration:**

```javascript
const exp = payload.exp;
const now = Date.now() / 1000;
const isExpired = now > exp;
console.log('Expired:', isExpired);
```

---

## Summary

### What We Learned

1. **Authentication vs Authorization** - Identity vs Permissions
2. **JWT** - Compact, self-contained tokens for stateless auth
3. **bcrypt** - Secure password hashing with adaptive cost
4. **Cookies** - Secure token storage with HttpOnly flag
5. **Flow** - Login → Set Cookie → Verify → Logout
6. **Security** - XSS protection, CSRF mitigation, HTTPS

### Key Files in This Project

**Backend:**

- `server/src/controllers/AuthControllers.ts` - login, logout, getMe
- `server/src/middlewares/auth.ts` - requireAuth middleware
- `server/src/models/User.ts` - User schema with password hashing

**Frontend:**

- `client/src/utils/api.ts` - Axios with credentials
- `client/src/components/Nav.tsx` - Auth status check
- `client/src/utils/auth.ts` - Auth helper functions

### Next Steps

- [ ] Implement refresh token rotation
- [ ] Add CSRF protection
- [ ] Set up rate limiting
- [ ] Add password strength validation
- [ ] Implement "Remember Me" functionality
- [ ] Add multi-factor authentication (MFA)

---

**Questions or issues?** Check the code in the files mentioned above or test the flow locally following the steps in this README.
`````
