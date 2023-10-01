import { Router } from 'express';
import { verifyAccessTokenMiddleware } from '~/middlewares/jwt.middleware';
import multerMiddlware from '~/middlewares/multer.middleware';
import {
	createNewMessageController,
	findAllMessagesByUserIdController,
} from './controllers/message.controller';

const messageRoutes = Router();

messageRoutes.post(
	'/create',
	verifyAccessTokenMiddleware,
	multerMiddlware.single('image'),
	createNewMessageController,
);
messageRoutes.get(
	'/:userId',
	verifyAccessTokenMiddleware,
	findAllMessagesByUserIdController,
);

export default messageRoutes;
