import { Router } from 'express';
import { login, refresh } from '#controllers';
import { logout } from '../controllers/LogoutController';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', logout);

export { authRouter };
