import { Socket } from 'socket.io';
import { VIDEO_SOCKET_EVENT } from './constants/video.constant';
import { socketIO } from '../socket/socket';
import { findConnectedUserByUserId } from '../socket/utils/socket.util';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const initVideoSocket = (socket: Socket) => {
	// VIDEO CALL
	socket.on(
		VIDEO_SOCKET_EVENT.SEND_VIDEO_CALL_RECEIVER_ID,
		async ({ senderID, receiverID }: { senderID: number; receiverID: number }) => {
			try {
				console.log('SEND_VIDEO_CALL_RECEIVER_ID');
				const videoCallReceiver = findConnectedUserByUserId({ userId: receiverID });
				const videoCallSender = findConnectedUserByUserId({ userId: senderID });

				if (!videoCallReceiver || !videoCallSender) throw new Error('User not online');

				const caller = await prisma.user.findFirst({
					where: {
						id: senderID,
					},
				});
				if (!caller) return;

				// Trả socketID về phía người gọi
				socket.emit(VIDEO_SOCKET_EVENT.RECEIVE_VIDEO_CALL_RECEIVER_ID, {
					receivedCallSocketID: videoCallReceiver.socketId,
					callerSocketID: videoCallSender.socketId,
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
				return;
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
