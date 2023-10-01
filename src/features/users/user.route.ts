import { Router } from 'express';
import { verifyAccessTokenMiddleware } from '~/middlewares/jwt.middleware';
import { findAllUsersByKeywordController } from './controllers/user.controller';

const userRoutes = Router();

userRoutes.post('/search', verifyAccessTokenMiddleware, findAllUsersByKeywordController);

export default userRoutes;
