import { IMAGE_EXTENSION, MESSAGE_TYPE } from '~/constants/constant';
import { infoLogger } from '~/utils/logger.util';
import MessageEntity from '../models/message.enity';
import { FindAllMessageByUserId, CreateMessage } from './message-service.type';

export const findAllMessageByUserIdService = async (param: FindAllMessageByUserId) => {
	try {
		const {
			senderId,
			receiverId,
			page,
			findAllMessagesByUserIdRepository,
			sortMessageList,
			mapMessageResponse,
		} = param;
		infoLogger(`Finding messages between [${senderId}], [${receiverId}] page: [${page}]`);
		const messageList: MessageEntity[] = await findAllMessagesByUserIdRepository({
			senderId,
			receiverId,
			page,
		});
		const sortedMessageList = sortMessageList(messageList);
		const result = sortedMessageList.map((message) => mapMessageResponse(message));

		return result;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const CreateMessageService = async (param: CreateMessage) => {
	try {
		const {
			senderId,
			receiverId,
			content,
			uploadImage,
			mapMessageResponse,
			createMessageRepository,
			sendLastestMessageSocket,
		} = param;
		let messageTypeId = 0;
		let uploadedImage: string | undefined;

		if (IMAGE_EXTENSION.some((extension) => content.includes(extension))) {
			messageTypeId = MESSAGE_TYPE.IMAGE;
			uploadedImage = await uploadImage(content);
		} else {
			messageTypeId = MESSAGE_TYPE.TEXT;
		}

		const message: MessageEntity = await createMessageRepository({
			senderId,
			receiverId,
			content: uploadedImage ? uploadedImage : content,
			messageTypeId,
		});
		const result = mapMessageResponse(message);
		sendLastestMessageSocket(result);

		return result;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
