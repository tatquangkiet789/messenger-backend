import { IFriendResponse } from '../models/friend.model';
import FriendEntity from '../models/friend.entity';
import UserEntity from '../../users/models/user.entity';
import MessageEntity from '../../messages/models/message.enity';
import { MESSAGES } from '~/constants/message.constant';
import { MESSAGE_TYPE } from '~/constants/constant';

export const filterCurrentUser = ({
	friendList,
	currentUserId,
}: {
	friendList: FriendEntity[];
	currentUserId: number;
}) => {
	const result: UserEntity[] = [];
	friendList.forEach((user: FriendEntity) => {
		if (user.firstUserId !== currentUserId) result.push(user.firstUserDetail!);
		if (user.secondUserId !== currentUserId) result.push(user.secondUserDetail!);
	});
	return result;
};

export const mapFriendResponse = ({
	user,
	lastestMessage,
}: {
	user: UserEntity;
	lastestMessage?: MessageEntity;
}) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let message: { content: string; messageTypeId: number } = null as any;
	if (lastestMessage) {
		message = {
			content: lastestMessage.content,
			messageTypeId: lastestMessage.messageTypeId,
		};
	} else {
		message = {
			content: MESSAGES.startANewMessage,
			messageTypeId: MESSAGE_TYPE.TEXT,
		};
	}
	const friendResponse: IFriendResponse = {
		id: user.id!,
		firstName: user.firstName,
		lastName: user.lastName,
		username: user.username,
		avatar: user.avatar,
		tick: user.tick,
		lastestMessage: message,
	};
	return friendResponse;
};
