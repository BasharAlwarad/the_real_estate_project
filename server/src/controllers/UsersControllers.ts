import { User } from '#models';
import bcrypt from 'bcrypt';
import { httpErrors } from '#utils';
import {
  UserController,
  CreateUserRequest,
  UpdateUserRequest,
  ApiResponse,
  UserResponse,
  UserParams,
} from '#types';
import mongoose from 'mongoose';

/**
 * User controllers for user account management
 *
 * These controllers handle CRUD operations for user accounts.
 * API documentation is maintained externally in: /docs/api/
 */

export const getAllUsers: UserController<
  never,
  ApiResponse<UserResponse[]>
> = async (req, res) => {
  const users = await User.find({});
  res.json({
    success: true,
    message: 'Users retrieved successfully',
    data: users as UserResponse[],
  });
};

export const getUserById: UserController<
  never,
  ApiResponse<UserResponse>
> = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    httpErrors.badRequest('Invalid user ID');
  }

  const user = await User.findById(id);

  if (!user) {
    httpErrors.notFound('User not found');
  }

  res.json({
    success: true,
    message: 'User retrieved successfully',
    data: user as UserResponse,
  });
};

export const createUser: UserController<
  CreateUserRequest,
  ApiResponse<UserResponse>
> = async (req, res) => {
  try {
    console.log('createUser - Request body:', req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(422).json({
        success: false,
        message: 'Request body cannot be empty',
      });
      return;
    }

    const { userName, email, password, image } = req.body as any;
    console.log('createUser - Extracted fields:', {
      userName,
      email,
      password: password ? '[HIDDEN]' : undefined,
      image,
    });

    if (!password) {
      res.status(422).json({
        success: false,
        message: 'Password is required',
      });
      return;
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      userName,
      email,
      image,
      password: hashedPassword,
    });

    console.log('createUser - About to save user with data:', {
      userName,
      email,
      image,
      password: '[HASHED]',
    });

    const savedUser = await newUser.save();
    console.log('createUser - User saved successfully:', savedUser._id);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: savedUser as UserResponse,
    });
  } catch (error) {
    console.error('createUser - Error:', error);
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const updateUser: UserController<
  UpdateUserRequest,
  ApiResponse<UserResponse>
> = async (req, res) => {
  const { id } = req.params;
  const updates: any = { ...req.body };

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    httpErrors.badRequest('Invalid user ID');
  }

  // Check if user exists first
  const existingUser = await User.findById(id);
  if (!existingUser) {
    httpErrors.notFound('User not found');
  }

  // If password provided, re-hash with bcrypt
  if (updates.password) {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(updates.password, saltRounds);
    updates.password = hashedPassword;
  }

  const updatedUser = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: 'User updated successfully',
    data: updatedUser as UserResponse,
  });
};

export const deleteUser: UserController<
  never,
  ApiResponse<UserResponse>
> = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    httpErrors.badRequest('Invalid user ID');
  }

  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    httpErrors.notFound('User not found');
  }

  res.json({
    success: true,
    message: 'User deleted successfully',
    data: deletedUser as UserResponse,
  });
};
