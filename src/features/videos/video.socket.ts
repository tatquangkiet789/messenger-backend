import { Socket } from 'socket.io';
import { VIDEO_SOCKET_EVENT } from './constants/video.constant';
import { socketIO } from '../socket/socket';
import { findConnectedUserByUserIdService } from '../users/services/connected-user.service';
import { USER_SOCKET_EVENT } from '../users/constants/user.constant';
import { findUserByIDSocketService } from '../users/services/user.service';
import { findUserByIDRepository } from '../users/repositories/user.repository';

export const initVideoSocket = (socket: Socket) => {
	// VIDEO CALL
	socket.on(
		VIDEO_SOCKET_EVENT.SEND_VIDEO_CALL_RECEIVER_ID,
		async ({ senderID, receiverID }: { senderID: number; receiverID: number }) => {
			try {
				const videoCallReceiver = findConnectedUserByUserIdService({ userId: receiverID });
				const videoCallSender = findConnectedUserByUserIdService({ userId: senderID })!;

				if (!videoCallReceiver) {
					return socket.emit(USER_SOCKET_EVENT.USER_NOT_ONLINE, {
						message: 'Người dùng hiện không online',
					});
				}

				// Trả socketID về phía người gọi
				socket.emit(VIDEO_SOCKET_EVENT.RECEIVE_VIDEO_CALL_RECEIVER_ID, {
					receivedCallSocketID: videoCallReceiver.socketId,
					callerSocketID: videoCallSender.socketId,
				});

				const caller = await findUserByIDSocketService({
					userID: senderID,
					findUserByIDRepository,
				});

				// Trả thông tin người gọi về phía người nhận
				const callerDetail = {
					name: `${caller.lastName} ${caller.firstName}`,
					avatar: caller.avatar,
					socketID: videoCallSender.socketId,
				};
				socketIO
					.to(videoCallReceiver.socketId)
					.emit(VIDEO_SOCKET_EVENT.SEND_CALLER_DETAIL, callerDetail);
			} catch (error) {
				throw new Error((error as Error).stack);
			}
		},
	);
	socket.on(VIDEO_SOCKET_EVENT.ANSWER_CALL, (data) => {
		try {
			const { callerSocketID, signalData } = data;
			console.log('socket.on(VIDEO_SOCKET_EVENT.ANSWER_CALL)');
			socketIO.to(callerSocketID).emit(VIDEO_SOCKET_EVENT.CALL_ACCEPTED, signalData);
		} catch (error) {
			throw new Error((error as Error).stack);
		}
	});
	socket.on(VIDEO_SOCKET_EVENT.CALL_USER, (data) => {
		try {
			const { receiverSocketID, signalData, callerDetail } = data;
			console.log('socket.on(VIDEO_SOCKET_EVENT.CALL_USER)');
			socketIO
				.to(receiverSocketID)
				.emit(VIDEO_SOCKET_EVENT.RECEIVED_CALL, { signalData, callerDetail });
		} catch (error) {
			throw new Error((error as Error).stack);
		}
	});
};
