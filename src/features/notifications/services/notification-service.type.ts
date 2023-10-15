/* eslint-disable @typescript-eslint/no-explicit-any */
import { FriendResponse } from '~/features/friends/models/friend.reponse';
import UserEntity from '~/features/users/models/user.entity';
import NotificationEntity from '../models/notification.entity';
import { AddFriendNotificationResponse } from '../models/notification.response';
import FriendEntity from '~/features/friends/models/friend.entity';

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
	findNotificationByUserIDRepository: ({
		senderID,
		receiverID,
	}: {
		senderID: number;
		receiverID: number;
	}) => Promise<any>;
	updateAddFriendNotificationDeleteRepository: ({
		notificationId,
		isDeleted,
	}: {
		notificationId: number;
		isDeleted: boolean;
	}) => Promise<any>;
	sendAddFriendNotificationSocket: (notification: NotificationEntity) => void;
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
	mapFriendResponse: ({
		user,
		lastestMessage,
	}: {
		user: UserEntity;
		lastestMessage?: any;
	}) => FriendResponse;
	filterCurrentUser: ({
		friend,
		currentUserId,
	}: {
		friend: FriendEntity;
		currentUserId: number;
	}) => UserEntity | any;
	checkIfUsersAreFriendRepository: ({
		currentUserID,
		userID,
	}: {
		currentUserID: number;
		userID: number;
	}) => Promise<boolean>;
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

export type DeleteAddFriendNotification = {
	userID: number;
	currentUserID: number;
	updateAddFriendNotificationDeleteRepository: ({
		notificationId,
		isDeleted,
	}: {
		notificationId: number;
		isDeleted: boolean;
	}) => Promise<any>;
	findNotificationByUserIDRepository: ({
		senderID,
		receiverID,
	}: {
		senderID: number;
		receiverID: number;
	}) => Promise<any>;
};
