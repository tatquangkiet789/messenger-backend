import { PrismaClient } from '@prisma/client';
import { MESSAGES } from '~/constants/message.constant';
import { MESSAGE_SIZE } from '~/constants/page.constant';

const prisma = new PrismaClient();

export const findLastestMessageByUserIdRepository = async ({
	senderId,
	receiverId,
}: {
	senderId: number;
	receiverId: number;
}) => {
	try {
		const lastestMessage = await prisma.message.findFirst({
			where: {
				deleted: false,
				OR: [
					{
						senderId: senderId,
						receiverId: receiverId,
					},
					{
						senderId: receiverId,
						receiverId: senderId,
					},
				],
			},
			include: {
				receiverDetail: true,
				senderDetail: true,
			},
			orderBy: [
				{
					createdDate: 'desc',
				},
			],
		});
		return lastestMessage;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const findAllMessagesByUserIdRepository = async ({
	senderId,
	receiverId,
	page,
}: {
	senderId: number;
	receiverId: number;
	page: number;
}) => {
	try {
		const offset = (page - 1) * MESSAGE_SIZE;
		const messageList = await prisma.message.findMany({
			where: {
				deleted: false,
				OR: [
					{
						senderId: senderId,
						receiverId: receiverId,
					},
					{
						senderId: receiverId,
						receiverId: senderId,
					},
				],
			},
			skip: offset,
			take: MESSAGE_SIZE,
			include: {
				senderDetail: true,
				receiverDetail: true,
			},
			orderBy: [
				{
					createdDate: 'desc',
				},
			],
		});
		return messageList;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const createMessageRepository = async ({
	senderId,
	receiverId,
	content,
	messageTypeId,
}: {
	senderId: number;
	receiverId: number;
	content: string;
	messageTypeId: number;
}) => {
	try {
		const result = await prisma.message.create({
			data: {
				content: content,
				senderId: senderId,
				receiverId: receiverId,
				messageTypeId: messageTypeId,
			},
			include: {
				senderDetail: true,
				receiverDetail: true,
			},
		});
		if (result) return result;

		throw new Error(MESSAGES.unknowError);
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
