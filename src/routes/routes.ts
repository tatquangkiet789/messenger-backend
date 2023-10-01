import { Express } from 'express';
import authRoutes from '~/features/auth/auth.route';
import friendRoutes from '~/features/friends/friend.route';
import messageRoutes from '~/features/messages/message.route';
import notificationRoutes from '~/features/notifications/notification.route';
import userRoutes from '~/features/users/user.route';

const appRoutes = (app: Express) => {
	app.use('/api/v1/auth', authRoutes);
	app.use('/api/v1/users', userRoutes);
	// app.use('/api/v1/friends', friendRoutes);
	// app.use('/api/v1/messages', messageRoutes);
	app.use('/api/v1/notifications', notificationRoutes);
};

export default appRoutes;
