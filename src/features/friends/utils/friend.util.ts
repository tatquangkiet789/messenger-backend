import { IFriendResponse } from '../models/friend.model';
import FriendEntity from '../models/friend.entity';
import UserEntity from '../../users/models/user.entity';
import MessageEntity from '../../messages/models/message.enity';
import { MESSAGES } from '~/constants/message.constant';
import { MESSAGE_TYPE } from '~/constants/constant';

export const filterCurrentUser = ({
	friend,
	currentUserId,
}: {
	friend: FriendEntity;
	currentUserId: number;
}) => {
	if (friend.firstUserId !== currentUserId && friend.firstUserDetail) {
		return friend.firstUserDetail;
	}
	if (friend.secondUserId !== currentUserId && friend.secondUserDetail) {
		return friend.secondUserDetail;
	}
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
