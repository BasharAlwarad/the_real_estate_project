import { Router } from 'express';
import { login } from '#controllers';
import { logout } from '../controllers/LogoutController';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/logout', logout);

export { authRouter };
