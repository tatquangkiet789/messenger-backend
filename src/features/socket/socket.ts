// import { Server, Socket } from 'socket.io';
// import { SOCKET_CONSTANT } from './constants/constants';
// import { addNewConnectedUserUtil } from '@/src/modules/socket/utils/socket.util';
// import notificationSocket from '../notifications/notification.socket';
// import { messageSocket } from '../messages/message.socket';
// import videoCallSocket from '../video-call/video-call.socket';

// const socketIO = (socketIO: Server) => {
//     try {
//         socketIO.on('connection', (socket: Socket) => {
//             socket.on(SOCKET_CONSTANT.NEW_USER, (username: string) =>
//                 addNewConnectedUserUtil({
//                     username: username,
//                     socketId: socket.id,
//                 }),
//             );
//             socket.join(socket.id);
//             messageSocket(socket, socketIO);
//             notificationSocket(socket);
//             videoCallSocket(socket, socketIO);
//             // socket.on('disconnect', () => removeConnectedUserUtil({ socketId: socket.id }));
//         });
//     } catch (err) {
//         console.log((err as Error).stack);
//     }
// };

// export default socketIO;
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { Express } from 'express';
import { SOCKET_CONSTANT } from './constants/constants';
import { createConnectedUser, findConnectedUserByUserId } from './utils/socket.util';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let socketIO: Server;

export const createSocketServer = (app: Express) => {
	const socketServer = createServer(app);
	socketIO = new Server(socketServer, {
		cors: {
			credentials: true,
			origin: 'http://localhost:3000',
			methods: ['GET', 'POST'],
		},
	});

	initSocketServer(socketIO);

	return { socketServer };
};

const initSocketServer = (socketIO: Server) => {
	socketIO.on('connection', (socket: Socket) => {
		socket.on(SOCKET_CONSTANT.NEW_USER, (userId: number) => {
			createConnectedUser({ userId: userId, socketId: socket.id });
		});

		// VIDEO CALL
		socket.on(
			SOCKET_CONSTANT.SEND_VIDEO_CALL_RECEIVER_ID,
			async ({ senderID, receiverID }: { senderID: number; receiverID: number }) => {
				const videoCallReceiver = findConnectedUserByUserId({ userId: receiverID });
				const videoCallSender = findConnectedUserByUserId({ userId: senderID });

				if (!videoCallReceiver || !videoCallSender) return;

				const caller = await prisma.user.findFirst({
					where: {
						id: senderID,
					},
				});
				if (!caller) return;
				// Trả socketID về phía người gọi
				socket.emit(SOCKET_CONSTANT.RECEIVE_VIDEO_CALL_RECEIVER_ID, {
					receivedCallSocketID: videoCallReceiver.socketId,
					callerSocketID: videoCallSender.socketId,
				});
				const callerDetail = {
					name: `${caller.lastName} ${caller.firstName}`,
					avatar: caller.avatar,
					socketID: videoCallSender.socketId,
				};
				// Trả thông tin người gọi về phía người nhận
				socketIO
					.to(videoCallReceiver.socketId)
					.emit(SOCKET_CONSTANT.SEND_CALLER_DETAIL, callerDetail);
				return;
			},
		);

		socket.on(SOCKET_CONSTANT.ANSWER_CALL, (data) => {
			const { callerSocketID, signalData } = data;
			socketIO.to(callerSocketID).emit(SOCKET_CONSTANT.CALL_ACCEPTED, signalData);
		});

		// socket.on('disconnect', () => {
		// 	socket.broadcast.emit('call-ended');
		// });
		socket.once(SOCKET_CONSTANT.CALL_USER, (data) => {
			const { receiverSocketID, signalData, callerDetail } = data;
			console.log('RECEIVED_CALL');
			socketIO
				.to(receiverSocketID)
				.emit(SOCKET_CONSTANT.RECEIVED_CALL, { signalData, callerDetail });
		});
	});
};

export { socketIO };

export default createSocketServer;
