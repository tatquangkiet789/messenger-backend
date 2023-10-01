/* eslint-disable @typescript-eslint/no-explicit-any */
import UserEntity from '~/features/users/models/user.entity';
import FriendEntity from '../models/friend.entity';
import { FriendResponse } from '../models/friend.reponse';

export type FindAllFriendByUserId = {
	currentUserId: number;
	page: number;
	findAllFriendsByUserIdRepository: ({
		userId,
		includeUserDetail,
		page,
	}: {
		userId: number;
		includeUserDetail: boolean;
		page: number;
	}) => Promise<any>;
	findLastestMessageByUserIdRepository: ({
		senderId,
		receiverId,
	}: {
		senderId: number;
		receiverId: number;
	}) => Promise<any>;
	filterCurrentUser: ({
		friendList,
		currentUserId,
	}: {
		friendList: FriendEntity[];
		currentUserId: number;
	}) => UserEntity[];
	mapFriendResponse: ({
		user,
		lastestMessage,
	}: {
		user: UserEntity;
		lastestMessage: any;
	}) => FriendResponse;
};
