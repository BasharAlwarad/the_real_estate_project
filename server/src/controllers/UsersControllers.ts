import { User } from '#models';
import { httpErrors } from '#utils';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

// API documentation is located in: src/docs/users.yaml

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieve all users from the database
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     description: Register a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file upload
 *             required:
 *               - userName
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Bad request - validation error or duplicate email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Unprocessable entity - empty request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *           example: "507f1f77bcf86cd799439011"
 *         description: MongoDB ObjectId of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user by ID
 *     description: Update a specific user by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *           example: "507f1f77bcf86cd799439011"
 *         description: MongoDB ObjectId of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "john_doe_updated"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.new@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "newSecurePassword123"
 *               image:
 *                 oneOf:
 *                   - type: string
 *                     format: binary
 *                     description: New profile image file upload
 *                   - type: string
 *                     format: uri
 *                     example: "https://example.com/new-profile.jpg"
 *                     description: URL to new profile image
 *                   - type: string
 *                     enum: [""]
 *                     description: Empty string to use default avatar
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Bad request - invalid user ID or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user by ID
 *     description: Delete a specific user by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *           example: "507f1f77bcf86cd799439011"
 *         description: MongoDB ObjectId of the user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Bad request - invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find({});
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    httpErrors.badRequest('Invalid user ID');
  }

  const user = await User.findById(id);

  if (!user) {
    httpErrors.notFound('User not found');
  }

  res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    httpErrors.unprocessableEntity('Request body cannot be empty');
  }

  const newUser = new User(req.body);
  const savedUser = await newUser.save();
  res.status(201).json({
    message: 'User created successfully',
    user: savedUser,
  });
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    httpErrors.badRequest('Invalid user ID');
  }

  // Check if user exists first
  const existingUser = await User.findById(id);
  if (!existingUser) {
    httpErrors.notFound('User not found');
  }

  const updatedUser = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({
    message: 'User updated successfully',
    user: updatedUser,
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    httpErrors.badRequest('Invalid user ID');
  }

  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    httpErrors.notFound('User not found');
  }

  res.json({
    message: 'User deleted successfully',
    user: deletedUser,
  });
};
