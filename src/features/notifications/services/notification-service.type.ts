/* eslint-disable @typescript-eslint/no-explicit-any */
import NotificationEntity from '../models/notification.entity';
import { AddFriendNotificationResponse } from '../models/notification.response';

export type FindAllAddFriendNotification = {
	receiverId: number;
	page: number;
	findAllAddFriendNotificationsRepository: ({
		receiverId,
		page,
	}: {
		receiverId: number;
		page: number;
	}) => Promise<any>;
	mapNotificationResponse: (notification: NotificationEntity) => AddFriendNotificationResponse;
};

export type CreateAddFriendNotification = {
	senderId: number;
	receiverId: number;
	createAddFriendNotificationRepository: ({
		senderId,
		receiverId,
	}: {
		senderId: number;
		receiverId: number;
	}) => Promise<any>;
	mapNotificationResponse: (notification: NotificationEntity) => AddFriendNotificationResponse;
};

export type AcceptAddFriendNotification = {
	notificationId: number;
	currentUserId: number;
	acceptAddFriendNotificationRepository: ({
		notificationId,
		currentUserId,
	}: {
		notificationId: number;
		currentUserId: number;
	}) => Promise<any>;
	findAddFriendNotificationByIdRepository: ({
		notificationId,
	}: {
		notificationId: number;
	}) => Promise<any>;
	createFriendRepository: ({
		currentUserId,
		userId,
	}: {
		currentUserId: number;
		userId: number;
	}) => Promise<any>;
};

export type DeclineAddFriendNotification = {
	notificationId: number;
	currentUserId: number;
	declineAddFriendNotificationRepository: ({
		notificationId,
		currentUserId,
	}: {
		notificationId: number;
		currentUserId: number;
	}) => Promise<any>;
	findAddFriendNotificationByIdRepository: ({
		notificationId,
	}: {
		notificationId: number;
	}) => Promise<any>;
};
