import { MESSAGES } from '~/constants/message.constant';
import { infoLogger } from '~/utils/logger.util';
import { SOCKET_CONSTANT } from '../socket/constants/constants';
import { socketIO } from '../socket/socket';
import { findConnectedUserByUserId } from '../socket/utils/socket.util';
import { MessageResponse } from './models/message.response';

export const sendLastestMessageSocket = (lastestMessage: MessageResponse) => {
	try {
		const receiverSocket = findConnectedUserByUserId({
			userId: lastestMessage.receiverDetail.id,
		});
		if (!receiverSocket) return;

		infoLogger(`Sending message to socketId: [${receiverSocket.socketId}]`);
		socketIO.to(receiverSocket.socketId).emit(SOCKET_CONSTANT.RECEIVE_MESSAGE, {
			content: lastestMessage,
		});
	} catch (error) {
		throw new Error(MESSAGES.unknowError);
	}
};

// export const messageSocket = async (socket: Socket, io: Server) => {
//     socket.on(SOCKET_CONSTANT.SEND_MESSAGE, async (data: IReceiveMessage) => {
//         const { senderName, receiverName } = data;
//         const receiverInfoSocket = findConnectedUserByUsernameUtil({
//             username: receiverName,
//         });
//         if (!receiverInfoSocket) return;
//         const senderInfo = await findUserByUsernameService(senderName);
//         const receiverInfo = await findUserByUsernameService(receiverName);

// const lastestMessage = await findLastestMessageByUserIdService({
//     senderId: senderInfo.id,
//     receiverId: receiverInfo.id,
// });
// if (!lastestMessage) return;
// const result: IMessageResponse = {
//     id: lastestMessage.id + 1,
//     content: lastestMessage.content,
//     messageTypeId: lastestMessage.messageTypeId,
//     senderDetail: {
//         id: senderInfo.id,
//         avatar: senderInfo.avatar,
//     },
//     receiverDetail: {
//         id: receiverInfo.id,
//         avatar: receiverInfo.avatar,
//     },
// };
//         infoLogger(
//             `Sending message to connected user with socketID: ${receiverInfoSocket.socketId}`,
//         );
//         // io.to(receiverInfoSocket.socketId!).emit(SOCKET_CONSTANT.RECEIVE_MESSAGE, {
//         //     content: result,
//         // });
//     });
// };
