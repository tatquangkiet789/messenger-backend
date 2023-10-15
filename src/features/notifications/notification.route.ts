import { Router } from 'express';
import { verifyAccessTokenMiddleware } from '~/middlewares/jwt.middleware';
import {
	findAllAddFriendNotificationsController,
	createAddFriendNotificationController,
	acceptAddFriendNotificationController,
	declineAddFriendNotificationController,
	deleteAddFriendNotificationController,
} from './controllers/notification.controller';

const notificationRoutes = Router();

notificationRoutes.get('/', verifyAccessTokenMiddleware, findAllAddFriendNotificationsController);
notificationRoutes.post(
	'/add-friend',
	verifyAccessTokenMiddleware,
	createAddFriendNotificationController,
);
notificationRoutes.post(
	'/accept',
	verifyAccessTokenMiddleware,
	acceptAddFriendNotificationController,
);
notificationRoutes.post(
	'/decline',
	verifyAccessTokenMiddleware,
	declineAddFriendNotificationController,
);
notificationRoutes.post(
	'/delete',
	verifyAccessTokenMiddleware,
	deleteAddFriendNotificationController,
);

export default notificationRoutes;
