import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '#controllers';

export const userRouter = Router();

userRouter.post(`/`, createUser);
userRouter.get(`/`, getAllUsers);
userRouter.get(`/:id`, getUserById);
userRouter.put(`/:id`, updateUser);
userRouter.delete(`/:id`, deleteUser);
