import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '#controllers';
import {
  validateBodyZod,
  cloudUploader,
  formMiddleWare,
  requireAuth,
  isUserOwner,
} from '#middlewares';
import { userCreateSchema, userUpdateSchema } from '#schemas';

export const userRouter = Router();

// /me endpoint moved to auth-service (GET /auth/me)
// userRouter.get('/me', requireAuth, getMe);

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
    isUserOwner,
    formMiddleWare,
    cloudUploader,
    validateBodyZod(userUpdateSchema),
    updateUser
  )
  .delete(requireAuth, isUserOwner, deleteUser);
