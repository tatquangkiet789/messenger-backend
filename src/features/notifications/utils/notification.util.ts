import NotificationEntity from '../models/notification.entity';
import { AddFriendNotificationResponse } from '../models/notification.response';

export const mapNotificationResponse = (notification: NotificationEntity) => {
	const { id, content, notificationTypeId, notificationSenderDetail } = notification;
	const result: AddFriendNotificationResponse = {
		id: id!,
		content: content,
		notificationTypeId: notificationTypeId,
		notificationSenderDetail: {
			firstName: notificationSenderDetail.firstName,
			lastName: notificationSenderDetail.lastName,
			avatar: notificationSenderDetail.avatar,
		},
	};

	return result;
};
