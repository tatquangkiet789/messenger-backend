import { PrismaClient } from '@prisma/client';
import { NOTIFICATION_MESSAGE, NOTIFICATION_TYPE } from '../constants/constants';
import { PAGE_SIZE } from '~/constants/constant';
import { MESSAGES } from '~/constants/message.constant';

const prisma = new PrismaClient();

export const findAllAddFriendNotificationsRepository = async ({
	receiverId,
	page,
}: {
	receiverId: number;
	page: number;
}) => {
	try {
		const offset = (page - 1) * PAGE_SIZE;
		const notificationList = await prisma.notification.findMany({
			where: {
				accepted: false,
				deleted: false,
				receiverId: receiverId,
			},
			take: PAGE_SIZE,
			skip: offset,
			include: {
				notificationSenderDetail: true,
			},
			orderBy: {
				createdDate: 'desc',
			},
		});
		return notificationList;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const createAddFriendNotificationRepository = async ({
	senderId,
	receiverId,
}: {
	senderId: number;
	receiverId: number;
}) => {
	try {
		const result = await prisma.notification.create({
			data: {
				content: NOTIFICATION_MESSAGE.ADD_FRIEND,
				accepted: false,
				deleted: false,
				createdDate: new Date(),
				notificationTypeId: NOTIFICATION_TYPE.ADD_FRIEND,
				receiverId: receiverId,
				senderId: senderId,
			},
			include: {
				notificationSenderDetail: true,
				notificationReceiverDetail: true,
			},
		});
		if (result) return result;

		throw new Error(MESSAGES.unknowError);
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const findAddFriendNotificationByIdRepository = async ({
	notificationId,
}: {
	notificationId: number;
}) => {
	try {
		const result = await prisma.notification.findFirst({
			where: {
				id: notificationId,
			},
		});
		return result;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const acceptAddFriendNotificationRepository = async ({
	notificationId,
	currentUserId,
}: {
	notificationId: number;
	currentUserId: number;
}) => {
	try {
		const result = await prisma.notification.updateMany({
			where: {
				id: notificationId,
				deleted: false,
				receiverId: currentUserId,
			},
			data: {
				accepted: true,
				content: NOTIFICATION_MESSAGE.ACCEPTED,
			},
		});
		if (result) return true;

		throw new Error(MESSAGES.unknowError);
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const declineAddFriendNotificationRepository = async ({
	notificationId,
	currentUserId,
}: {
	notificationId: number;
	currentUserId: number;
}) => {
	try {
		const result = await prisma.notification.updateMany({
			where: {
				id: notificationId,
				deleted: false,
				receiverId: currentUserId,
			},
			data: {
				accepted: false,
				content: NOTIFICATION_MESSAGE.DECLINED,
				deleted: true,
			},
		});
		if (result) return result;

		throw new Error(MESSAGES.unknowError);
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
