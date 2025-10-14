import { User } from '#models';
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
  if (!req.body || Object.keys(req.body).length === 0) {
    httpErrors.unprocessableEntity('Request body cannot be empty');
  }

  const newUser = new User(req.body);
  const savedUser = await newUser.save();

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: savedUser as UserResponse,
  });
};

export const updateUser: UserController<
  UpdateUserRequest,
  ApiResponse<UserResponse>
> = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
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
