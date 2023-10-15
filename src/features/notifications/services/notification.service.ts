import { MESSAGES } from '~/constants/message.constant';
import NotificationEntity from '../models/notification.entity';
import { AddFriendNotificationResponse } from '../models/notification.response';
import {
	AcceptAddFriendNotification,
	CreateAddFriendNotification,
	DeclineAddFriendNotification,
	DeleteAddFriendNotification,
	FindAllAddFriendNotification,
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
			findNotificationByUserIDRepository,
			updateAddFriendNotificationDeleteRepository,
		} = param;
		const existed: NotificationEntity = await findNotificationByUserIDRepository({
			senderID: senderId,
			receiverID: receiverId,
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let result: NotificationEntity = null as any;

		if (!existed) {
			result = await createAddFriendNotificationRepository({
				senderId,
				receiverId,
			});
		}
		// Đã tồn tại nhưng deleted = true
		if (existed.deleted) {
			await updateAddFriendNotificationDeleteRepository({
				notificationId: existed.id!,
				isDeleted: false,
			});
			result = await findNotificationByUserIDRepository({
				senderID: senderId,
				receiverID: receiverId,
			});
		}
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
			checkIfUsersAreFriendRepository,
			acceptAddFriendNotificationRepository,
			findAddFriendNotificationByIdRepository,
			createFriendRepository,
			mapFriendResponse,
			filterCurrentUser,
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

		const accepted: boolean = await acceptAddFriendNotificationRepository({
			notificationId: existed.id!,
			currentUserId,
		});

		const isFriend = await checkIfUsersAreFriendRepository({
			currentUserID: existed.senderId,
			userID: existed.receiverId,
		});

		if (accepted && !isFriend) {
			const friend = await createFriendRepository({
				currentUserId: existed.senderId,
				userId: existed.receiverId,
			});

			const filtered = filterCurrentUser({ friend, currentUserId });
			const result = mapFriendResponse({ user: filtered });
			return result;
		}

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

export const deleteAddFriendNotificationService = async (param: DeleteAddFriendNotification) => {
	try {
		const {
			userID,
			currentUserID,
			findNotificationByUserIDRepository,
			updateAddFriendNotificationDeleteRepository,
		} = param;
		const existed: NotificationEntity = await findNotificationByUserIDRepository({
			senderID: currentUserID,
			receiverID: userID,
		});

		if (!existed) {
			throw new Error(MESSAGES.addFriendNotificationNotFound);
		}
		if (existed.deleted) {
			throw new Error(MESSAGES.cannotDeclineADeclinedAddFriendNotification);
		}

		const deletedAddFriendNotificationID = existed.id!;

		const result: number = await updateAddFriendNotificationDeleteRepository({
			notificationId: existed.id!,
			isDeleted: true,
		});

		if (result) return deletedAddFriendNotificationID;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
