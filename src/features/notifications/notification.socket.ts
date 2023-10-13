import { MESSAGES } from '~/constants/message.constant';
import NotificationEntity from './models/notification.entity';
import { findConnectedUserByUserId } from '../socket/utils/socket.util';
import { socketIO } from '../socket/socket';
import { infoLogger } from '~/utils/logger.util';
import { FriendResponse } from '../friends/models/friend.reponse';
import { mapNotificationResponse } from './utils/notification.util';
import { NOTIFICATION_SOCKET_EVENT } from './constants/notification.constant';

export const sendAddFriendNotificationSocket = (notification: NotificationEntity) => {
	try {
		const { notificationReceiverDetail } = notification;
		const receiverSocket = findConnectedUserByUserId({
			userId: notificationReceiverDetail.id,
		});
		if (!receiverSocket) return;

		const result = mapNotificationResponse(notification);

		// const result = `${notificationSenderDetail.lastName} ${notificationSenderDetail.firstName} ${content}`;
		socketIO
			.to(receiverSocket.socketId)
			.emit(NOTIFICATION_SOCKET_EVENT.SEND_ADD_FRIEND_NOTIFICATION, { content: result });
	} catch (error) {
		throw new Error(MESSAGES.unknowError);
	}
};

export const sendAcceptedAddFriendNotificationSocket = (friend: FriendResponse) => {
	try {
		const { id } = friend;
		const receiverSocket = findConnectedUserByUserId({ userId: id });
		if (!receiverSocket) return;

		infoLogger(
			`Sending accepted add friend notification to socketID: [${receiverSocket.socketId}]`,
		);
		socketIO
			.to(receiverSocket.socketId)
			.emit(NOTIFICATION_SOCKET_EVENT.SEND_ACCEPTED_ADD_FRIEND_NOTIFICATION, {
				content: friend,
			});
	} catch (error) {
		throw new Error(MESSAGES.unknowError);
	}
};
