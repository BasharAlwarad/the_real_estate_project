import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getMe,
} from '#controllers';
import {
  validateBodyZod,
  cloudUploader,
  formMiddleWare,
  requireAuth,
} from '#middlewares';
import { userCreateSchema, userUpdateSchema } from '#schemas';

export const userRouter = Router();

userRouter.get('/me', requireAuth, getMe);

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
    requireAuth,
    formMiddleWare,
    cloudUploader,
    validateBodyZod(userUpdateSchema),
    updateUser
  )
  .delete(requireAuth, deleteUser);
