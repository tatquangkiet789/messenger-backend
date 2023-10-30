import MessageEntity from '../models/message.enity';
import { MessageResponse, ParentMessageResponse } from '../models/message.response';

export const sortMessageList = (messageList: MessageEntity[]) => {
	return messageList.sort((a: MessageEntity, b: MessageEntity) => {
		return a.createdDate.getTime() - b.createdDate.getTime();
	});
};

export const mapParentMessageResponse = (message: MessageEntity) => {
	const parentMessageResponse: ParentMessageResponse = {
		id: message.id,
		content: message.content,
		messageTypeId: message.messageTypeId,
		senderDetail: {
			id: message.senderId,
			name: `${message.senderDetail!.lastName} ${message.senderDetail!.firstName}`,
		},
	};
	return parentMessageResponse;
};

export const mapMessageResponse = (message: MessageEntity) => {
	const messageResponse: MessageResponse = {
		id: message.id,
		content: message.content,
		messageTypeId: message.messageTypeId,
		senderDetail: {
			id: message.senderId,
			avatar: message.senderDetail!.avatar,
			name: `${message.senderDetail!.lastName} ${message.senderDetail!.firstName}`,
		},
		receiverDetail: {
			id: message.receiverId,
			avatar: message.receiverDetail!.avatar,
			name: `${message.receiverDetail!.lastName} ${message.receiverDetail!.firstName}`,
		},
		parentDetail: message.parentMessageDetail
			? mapParentMessageResponse(message.parentMessageDetail)
			: null,
	};
	return messageResponse;
};
