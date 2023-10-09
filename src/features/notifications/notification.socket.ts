import { MESSAGES } from '~/constants/message.constant';
import NotificationEntity from './models/notification.entity';
import { findConnectedUserByUserId } from '../socket/utils/socket.util';
import { socketIO } from '../socket/socket';
import { SOCKET_CONSTANT } from '../socket/constants/constants';
import { infoLogger } from '~/utils/logger.util';
import { FriendResponse } from '../friends/models/friend.reponse';
import { mapNotificationResponse } from './utils/notification.util';

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
			.emit(SOCKET_CONSTANT.SEND_ADD_FRIEND_NOTIFICATION, { content: result });
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
			.emit(SOCKET_CONSTANT.SEND_ACCEPTED_ADD_FRIEND_NOTIFICATION, { content: friend });
	} catch (error) {
		throw new Error(MESSAGES.unknowError);
	}
};
