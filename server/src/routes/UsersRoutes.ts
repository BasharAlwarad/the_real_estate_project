import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '#controllers';
import { validateBodyZod, cloudUploader, formMiddleWare } from '#middlewares';
import { userCreateSchema, userUpdateSchema } from '#schemas';

export const userRouter = Router();

userRouter
  .route('/')
  .get(getAllUsers)
  .post(
    formMiddleWare,
    cloudUploader,
    validateBodyZod(userCreateSchema),
    createUser
  );

userRouter
  .route('/:id')
  .get(getUserById)
  .put(
    formMiddleWare,
    cloudUploader,
    validateBodyZod(userUpdateSchema),
    updateUser
  )
  .delete(deleteUser);
