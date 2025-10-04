import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '#controllers';
import { validateBodyZod } from '#middlewares';
import { userInputSchema, userUpdateSchema } from '#schemas';

export const userRouter = Router();

userRouter
  .route('/')
  .get(getAllUsers)
  .post(validateBodyZod(userInputSchema), createUser);

userRouter
  .route('/:id')
  .get(getUserById)
  .put(validateBodyZod(userUpdateSchema), updateUser)
  .delete(deleteUser);
