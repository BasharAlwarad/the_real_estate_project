import { User } from '#models';
import { httpErrors } from '#utils';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

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
