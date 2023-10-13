import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { Express } from 'express';
import { SOCKET_CONSTANT } from './constants/socket.constant';
import { createConnectedUser } from './utils/socket.util';
import { initVideoSocket } from '../videos/video.socket';

let socketIO: Server;

export const createSocketServer = (app: Express) => {
	const socketServer = createServer(app);
	socketIO = new Server(socketServer, {
		cors: {
			credentials: true,
			origin: ['http://localhost:3000', 'http://192.168.1.224:3000'],
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
		initVideoSocket(socket);
	});
};

export { socketIO };

export default createSocketServer;
