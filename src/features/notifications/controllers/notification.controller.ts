import { Request, Response } from 'express';
import {
	acceptAddFriendNotificationService,
	createAddFriendNotificationService,
	declineAddFriendNotificationService,
	deleteAddFriendNotificationService,
	findAllAddFriendNotificationsService,
} from '../services/notification.service';
import {
	acceptAddFriendNotificationRepository,
	createAddFriendNotificationRepository,
	findAddFriendNotificationByIdRepository,
	findAllAddFriendNotificationsRepository,
	declineAddFriendNotificationRepository,
	updateAddFriendNotificationDeleteRepository,
	findNotificationByUserIDRepository,
} from '../repositories/notification.repository';
import { mapNotificationResponse } from '../utils/notification.util';
import {
	checkIfUsersAreFriendRepository,
	createFriendRepository,
} from '~/features/friends/repositories/friend.repository';
import { MESSAGES } from '~/constants/message.constant';
import { sendAddFriendNotificationSocket } from '../notification.socket';
import { filterCurrentUser, mapFriendResponse } from '~/features/friends/utils/friend.util';

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
			sendAddFriendNotificationSocket,
			findNotificationByUserIDRepository,
			updateAddFriendNotificationDeleteRepository,
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

		const result = await acceptAddFriendNotificationService({
			notificationId: notificationId as number,
			currentUserId: currentUserId as number,
			findAddFriendNotificationByIdRepository,
			acceptAddFriendNotificationRepository,
			createFriendRepository,
			filterCurrentUser,
			mapFriendResponse,
			checkIfUsersAreFriendRepository,
		});

		if (result)
			return res
				.status(200)
				.send({ message: MESSAGES.addFriendSuccessfully, content: result });

		throw new Error(MESSAGES.unknowError);
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

export const deleteAddFriendNotificationController = async (req: Request, res: Response) => {
	try {
		const { userID } = req.body;
		const { id: currentUserID } = req.currentUser;

		const deletedAddFriendNotificationID = await deleteAddFriendNotificationService({
			userID: userID as number,
			currentUserID: currentUserID as number,
			findNotificationByUserIDRepository,
			updateAddFriendNotificationDeleteRepository,
		});

		return res.status(200).send({ deletedAddFriendNotificationID });
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}
};
