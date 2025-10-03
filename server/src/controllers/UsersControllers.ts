import { User } from '#models';
import { httpErrors } from '#utils';
import mongoose from 'mongoose';

export const getAllUsers = async (req, res, next) => {
  const users = await User.find({});
  if (!users || users.length === 0) {
    httpErrors.notFound('No users found');
  }
  res.json(users);
};

export const getUserById = async (req, res, next) => {
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

export const createUser = async (req, res, next) => {
  const newUser = new User(req.body);
  const savedUser = await newUser.save();
  res.status(201).json({
    message: 'User created successfully',
    user: savedUser,
  });
};

export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    httpErrors.badRequest('Invalid user ID');
  }

  const updatedUser = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    httpErrors.notFound('User not found');
  }

  res.json({
    message: 'User updated successfully',
    user: updatedUser,
  });
};

export const deleteUser = async (req, res, next) => {
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
