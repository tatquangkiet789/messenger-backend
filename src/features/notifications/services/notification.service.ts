import { MESSAGES } from '~/constants/message.constant';
import NotificationEntity from '../models/notification.entity';
import { AddFriendNotificationResponse } from '../models/notification.response';
import {
	FindAllAddFriendNotification,
	CreateAddFriendNotification,
	AcceptAddFriendNotification,
	DeclineAddFriendNotification,
} from './notification-service.type';

export const findAllAddFriendNotificationsService = async (param: FindAllAddFriendNotification) => {
	try {
		const {
			findAllAddFriendNotificationsRepository,
			receiverId,
			page,
			mapNotificationResponse,
		} = param;
		const result: NotificationEntity[] = await findAllAddFriendNotificationsRepository({
			receiverId: receiverId,
			page: page,
		});
		const response: AddFriendNotificationResponse[] = result.map(
			(notification: NotificationEntity) => mapNotificationResponse(notification),
		);

		return response;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const createAddFriendNotificationService = async (param: CreateAddFriendNotification) => {
	try {
		const {
			senderId,
			receiverId,
			createAddFriendNotificationRepository,
			mapNotificationResponse,
			sendAddFriendNotificationSocket,
		} = param;
		const result: NotificationEntity = await createAddFriendNotificationRepository({
			senderId,
			receiverId,
		});
		sendAddFriendNotificationSocket(result);

		const response = mapNotificationResponse(result);
		return response;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const acceptAddFriendNotificationService = async (param: AcceptAddFriendNotification) => {
	try {
		const {
			notificationId,
			currentUserId,
			acceptAddFriendNotificationRepository,
			findAddFriendNotificationByIdRepository,
			createFriendRepository,
		} = param;
		const existed: NotificationEntity = await findAddFriendNotificationByIdRepository({
			notificationId,
		});

		if (!existed) {
			throw new Error(MESSAGES.addFriendNotificationNotFound);
		}
		if (existed.deleted) {
			throw new Error(MESSAGES.addFriendNotificationDeleted);
		}
		if (existed.senderId === currentUserId) {
			throw new Error(MESSAGES.addFriendNotificationSenderCannotAccept);
		}

		const result: number = await acceptAddFriendNotificationRepository({
			notificationId: existed.id!,
			currentUserId,
		});

		const friend = await createFriendRepository({
			currentUserId: existed.senderId,
			userId: existed.receiverId,
		});

		if (result && friend) return true;

		throw new Error(MESSAGES.unknowError);
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const declineAddFriendNotificationService = async (param: DeclineAddFriendNotification) => {
	try {
		const {
			notificationId,
			currentUserId,
			findAddFriendNotificationByIdRepository,
			declineAddFriendNotificationRepository,
		} = param;
		const existed: NotificationEntity = await findAddFriendNotificationByIdRepository({
			notificationId,
		});

		if (!existed) {
			throw new Error(MESSAGES.addFriendNotificationNotFound);
		}
		if (existed.deleted) {
			throw new Error(MESSAGES.cannotDeclineADeclinedAddFriendNotification);
		}

		const result: number = await declineAddFriendNotificationRepository({
			notificationId: existed.id!,
			currentUserId,
		});

		return result;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
