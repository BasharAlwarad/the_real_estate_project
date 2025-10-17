import { Router } from 'express';
import { login, logout, refresh } from '#controllers';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', logout);

export { authRouter };
