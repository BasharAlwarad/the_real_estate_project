import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '#controllers';
import { zodValidate } from '#middlewares';
import { userInputSchema } from '#schemas';

export const userRouter = Router();
userRouter
  .route('/')
  .get(getAllUsers)
  .post(zodValidate(userInputSchema), createUser);
userRouter
  .route('/:id')
  .get(getUserById)
  .put(zodValidate(userInputSchema), updateUser)
  .delete(deleteUser);
