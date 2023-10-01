import { MESSAGES } from '~/constants/message.constant';
import NotificationEntity from './models/notification.entity';
import { findConnectedUserByUserId } from '../socket/utils/socket.util';
import { socketIO } from '../socket/socket';
import { SOCKET_CONSTANT } from '../socket/constants/constants';
import { infoLogger } from '~/utils/logger.util';

export const sendAddFriendNotification = (notification: NotificationEntity) => {
	try {
		const { content, notificationSenderDetail, notificationReceiverDetail } = notification;
		const receiverSocket = findConnectedUserByUserId({
			userId: notificationReceiverDetail.id,
		});
		if (!receiverSocket) return;

		const result = `${notificationSenderDetail.lastName} ${notificationSenderDetail.firstName} ${content}`;
		infoLogger(`Sending add friend notification to socketID: [${receiverSocket.socketId}]`);
		socketIO
			.to(receiverSocket.socketId)
			.emit(SOCKET_CONSTANT.SEND_ADD_FRIEND_NOTIFICATION, { content: result });
	} catch (error) {
		throw new Error(MESSAGES.unknowError);
	}
};
