import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { User } from '../models/User.js';

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await User.find({});
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid user ID');
  }

  const user = await User.findById(id);

  if (!user) {
    throw new Error('user not found');
  }

  res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
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
    throw new Error('Invalid user ID');
  }

  const updatedUser = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new Error('User not found');
  }

  res.json({
    message: 'User updated successfully',
    user: updatedUser,
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid user ID');
  }

  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    throw new Error('User not found');
  }

  res.json({
    message: 'User deleted successfully',
    user: deletedUser,
  });
};
