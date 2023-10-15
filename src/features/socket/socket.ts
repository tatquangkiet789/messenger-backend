import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { Express } from 'express';
import { initVideoSocket } from '../videos/video.socket';
import { createConnectedUserService } from '../users/services/connected-user.service';
import { USER_SOCKET_EVENT } from '../users/constants/user.constant';

let socketIO: Server;

export const createSocketServer = (app: Express, origin: string | undefined) => {
	const socketServer = createServer(app);
	socketIO = new Server(socketServer, {
		cors: {
			credentials: true,
			origin: origin,
			methods: ['GET', 'POST'],
		},
	});

	initSocketServer(socketIO);

	return { socketServer };
};

const initSocketServer = (socketIO: Server) => {
	socketIO.on('connection', (socket: Socket) => {
		socket.on(USER_SOCKET_EVENT.NEW_USER, (userId: number) => {
			createConnectedUserService({ userId: userId, socketId: socket.id });
		});
		initVideoSocket(socket);
	});
};

export { socketIO };

export default createSocketServer;
