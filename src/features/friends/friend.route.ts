import { Router } from 'express';
import { findAllFriendsController } from './controllers/friend.controller';
import { verifyAccessTokenMiddleware } from '~/middlewares/jwt.middleware';

const friendRoutes = Router();

friendRoutes.get('/', verifyAccessTokenMiddleware, findAllFriendsController);

export default friendRoutes;
