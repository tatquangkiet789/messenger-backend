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
import { createConnectedUser } from './utils/socket.util';

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
		// socket.on(SOCKET_CONSTANT.SEND_VIDEO_CALL_RECEIVER_ID, ({ userId }: { userId: number }) => {
		// 	const videoCallReceiver = findConnectedUserByUserId({ userId });
		// 	if (videoCallReceiver) {
		// 		socket.emit(SOCKET_CONSTANT.RECEIVE_VIDEO_CALL_RECEIVER_ID, {
		// 			videoCallReceiverSocketId: videoCallReceiver.socketId,
		// 		});
		// 	}
		// 	console.error('Người dùng hiện không online');
		// });
		// socket.on(SOCKET_CONSTANT.ANSWER_CALL, (data: any) => {
		// 	const { to, signal } = data;
		// 	socketIO.to(to).emit('call-accepted', signal);
		// });

		// socket.on('disconnect', () => {
		// 	socket.broadcast.emit('call-ended');
		// });
		// socket.on('call-user', (data: any) => {
		// 	const { userToCall, signalData, from, name } = data;
		// 	socketIO.to(userToCall).emit('call-user', { signal: signalData, from, name });
		// });
	});
};

export { socketIO };

export default createSocketServer;
