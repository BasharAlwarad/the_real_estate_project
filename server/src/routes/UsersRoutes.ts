import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/UsersControllers.js';

const userRouter = Router();

userRouter.post(`/`, createUser);
userRouter.get(`/`, getAllUsers);
userRouter.get(`/:id`, getUserById);
userRouter.put(`/:id`, updateUser);
userRouter.delete(`/:id`, deleteUser);

export default userRouter;
