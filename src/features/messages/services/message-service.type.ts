/* eslint-disable @typescript-eslint/no-explicit-any */
import MessageEntity from '../models/message.enity';
import { MessageResponse } from '../models/message.response';

export type FindAllMessageByUserId = {
	senderId: number;
	receiverId: number;
	page: number;
	findAllMessagesByUserIdRepository: ({
		senderId,
		receiverId,
		page,
	}: {
		senderId: number;
		receiverId: number;
		page: number;
	}) => Promise<any>;
	sortMessageList: (messageList: MessageEntity[]) => MessageEntity[];
	mapMessageResponse: (message: MessageEntity) => MessageResponse;
};

export type CreateMessage = {
	senderId: number;
	receiverId: number;
	content: string;
	createMessageRepository: ({
		senderId,
		receiverId,
		content,
		messageTypeId,
	}: {
		senderId: number;
		receiverId: number;
		content: string;
		messageTypeId: number;
	}) => Promise<any>;
	uploadImage: (content: string) => Promise<string | undefined>;
	mapMessageResponse: (message: MessageEntity) => MessageResponse;
	sendLastestMessage: (lastestMessage: MessageResponse) => void;
};
