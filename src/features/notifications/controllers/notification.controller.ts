import { Request, Response } from 'express';
import {
	acceptAddFriendNotificationService,
	createAddFriendNotificationService,
	declineAddFriendNotificationService,
	findAllAddFriendNotificationsService,
} from '../services/notification.service';
import {
	acceptAddFriendNotificationRepository,
	createAddFriendNotificationRepository,
	findAddFriendNotificationByIdRepository,
	findAllAddFriendNotificationsRepository,
	declineAddFriendNotificationRepository,
} from '../repositories/notification.repository';
import { mapNotificationResponse } from '../utils/notification.util';
import { createFriendRepository } from '~/features/friends/repositories/friend.repository';
import { MESSAGES } from '~/constants/message.constant';

export const findAllAddFriendNotificationsController = async (req: Request, res: Response) => {
	try {
		const page = req.query.page || 1;
		const { id: receiverId } = req.currentUser;

		const result = await findAllAddFriendNotificationsService({
			receiverId: receiverId as number,
			page: page as number,
			findAllAddFriendNotificationsRepository,
			mapNotificationResponse,
		});

		return res.status(200).send({ content: result });
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}
};

export const createAddFriendNotificationController = async (req: Request, res: Response) => {
	try {
		const { id: senderId } = req.currentUser;
		const { receiverId } = req.body;

		const result = await createAddFriendNotificationService({
			senderId: senderId as number,
			receiverId: receiverId as number,
			createAddFriendNotificationRepository,
			mapNotificationResponse,
		});

		return res.status(200).send({ content: result });
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}
};

export const acceptAddFriendNotificationController = async (req: Request, res: Response) => {
	try {
		const { notificationId } = req.body;
		const { id: currentUserId } = req.currentUser;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const result = await acceptAddFriendNotificationService({
			notificationId: notificationId as number,
			currentUserId: currentUserId as number,
			findAddFriendNotificationByIdRepository,
			acceptAddFriendNotificationRepository,
			createFriendRepository,
		});

		return res.status(200).send({ message: MESSAGES.addFriendSuccessfully });
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}
};

export const declineAddFriendNotificationController = async (req: Request, res: Response) => {
	try {
		const { notificationId } = req.body;
		const { id: currentUserId } = req.currentUser;

		const result = await declineAddFriendNotificationService({
			notificationId: notificationId as number,
			currentUserId: currentUserId as number,
			declineAddFriendNotificationRepository,
			findAddFriendNotificationByIdRepository,
		});

		return res.status(200).send({ content: result });
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}
};
