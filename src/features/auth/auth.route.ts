import { Router } from 'express';
import {
	verifyRefreshTokenMiddleware,
	verifyAccessTokenMiddleware,
} from '~/middlewares/jwt.middleware';
import multerMiddlware from '~/middlewares/multer.middleware';
import {
	loginController,
	registerController,
	refreshTokenController,
	logoutUserController,
	updatePasswordController,
	findCurrentUserByAccessTokenController,
} from './controllers/auth.controller';

const authRoutes = Router();

authRoutes.post('/login', multerMiddlware.none(), loginController);
authRoutes.post('/register', multerMiddlware.single('avatar'), registerController);
authRoutes.post(
	'/refresh-token',
	verifyRefreshTokenMiddleware,
	multerMiddlware.none(),
	refreshTokenController,
);
authRoutes.post('/logout', multerMiddlware.none(), logoutUserController);
authRoutes.post(
	'/update-password',
	verifyAccessTokenMiddleware,
	multerMiddlware.none(),
	updatePasswordController,
);
authRoutes.post(
	'/current-user',
	verifyAccessTokenMiddleware,
	multerMiddlware.none(),
	findCurrentUserByAccessTokenController,
);

export default authRoutes;
