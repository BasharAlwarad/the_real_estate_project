import { User } from '#models';
import { httpErrors, asyncHandler } from '#utils';
import mongoose from 'mongoose';

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (!users || users.length === 0) {
    httpErrors.notFound('No users found');
  }
  res.json(users);
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    httpErrors.badRequest('Invalid user ID');
  }

  const user = await User.findById(id);

  if (!user) {
    httpErrors.notFound('User not found');
  }

  res.json(user);
});

export const createUser = asyncHandler(async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(201).json(newUser);
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    httpErrors.badRequest('Invalid user ID');
  }

  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    httpErrors.notFound('User not found');
  }

  res.json(updatedUser);
});

export const deleteUser = asyncHandler(async (req, res) => {
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
  });
});
