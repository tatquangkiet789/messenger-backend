import { MESSAGES } from '~/constants/message.constant';
import { infoLogger } from '~/utils/logger.util';
import { socketIO } from '../socket/socket';
import { MessageResponse } from './models/message.response';
import { MESSAGE_SOCKET_EVENT } from './constants/message.constant';
import { findConnectedUserByUserIdService } from '../users/services/connected-user.service';

export const sendLastestMessageSocket = (lastestMessage: MessageResponse) => {
	try {
		const receiverSocket = findConnectedUserByUserIdService({
			userId: lastestMessage.receiverDetail.id,
		});
		if (!receiverSocket) return;

		infoLogger(`Sending message to socketId: [${receiverSocket.socketId}]`);
		socketIO.to(receiverSocket.socketId).emit(MESSAGE_SOCKET_EVENT.RECEIVE_MESSAGE, {
			content: lastestMessage,
		});
	} catch (error) {
		throw new Error(MESSAGES.unknowError);
	}
};
