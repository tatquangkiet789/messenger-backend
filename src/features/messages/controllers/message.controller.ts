import { uploadImage } from '~/utils/cloudinary.util';
import { errorLogger } from '~/utils/logger.util';
import { sendLastestMessageSocket } from '../message.socket';
import {
	findAllMessagesByUserIdRepository,
	createMessageRepository,
} from '../repositories/message.repository';
import { findAllMessageByUserIdService, CreateMessageService } from '../services/message.service';
import { mapMessageResponse, sortMessageList } from '../utils/message.util';
import { Request, Response } from 'express';

// [GET] /api/v1/messages/:userId
export const findAllMessagesByUserIdController = async (req: Request, res: Response) => {
	try {
		const { id: currentUserId } = req.currentUser;
		const { userId } = req.params;
		const page = req.query.page || 1;

		const result = await findAllMessageByUserIdService({
			senderId: currentUserId,
			receiverId: parseInt(userId),
			page: page as number,
			findAllMessagesByUserIdRepository,
			mapMessageResponse,
			sortMessageList,
		});

		return res.status(200).send({ content: result });
	} catch (error) {
		const err = error as Error;
		errorLogger(err.stack);
		return res.status(400).send({ message: err.message });
	}
};

// [POST] /api/v1/messages/create
export const createNewMessageController = async (req: Request, res: Response) => {
	try {
		const { id: currentUserId } = req.currentUser;
		const { receiverId, content, parentId } = req.body;
		const image = req.file?.path;

		const result = await CreateMessageService({
			content: image ? image : content,
			parentId,
			createMessageRepository,
			mapMessageResponse,
			senderId: currentUserId as number,
			receiverId: receiverId as number,
			uploadImage,
			sendLastestMessageSocket,
		});

		return res.status(201).send({ content: result });
	} catch (error) {
		const err = error as Error;
		errorLogger(err.stack);
		return res.status(400).send({ message: err.message });
	}
};
