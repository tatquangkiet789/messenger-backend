import { infoLogger } from '~/utils/logger.util';
import { ConnectedUser } from '../models/connected-user.entity';

let connectedUserList: ConnectedUser[] = [];

export const createConnectedUserService = (connectedUser: ConnectedUser) => {
	try {
		const existedUserSocket = connectedUserList.find(
			(user) => user.socketId === connectedUser.socketId,
		);
		if (existedUserSocket) return;

		const existedUser = connectedUserList.find((user) => user.userId === connectedUser.userId);

		if (existedUser) {
			connectedUserList = [...connectedUserList].map((user) => {
				if (user.userId === existedUser.userId) {
					return { ...user, socketId: connectedUser.socketId };
				}
				return user;
			});
			infoLogger(
				`Update userID: [${existedUser.userId}] with new socketID: [${connectedUser.socketId}]`,
			);
			console.log(connectedUserList);
		} else {
			connectedUserList = [...connectedUserList, connectedUser];
			infoLogger(`Add new connected user with userID: [${connectedUser.userId}]`);
			console.log(connectedUserList);
		}
	} catch (error) {
		console.error((error as Error).stack);
		throw new Error((error as Error).message);
	}
};

export const findConnectedUserByUserIdService = ({ userId }: { userId: number }) => {
	try {
		return connectedUserList.find((user: ConnectedUser) => user.userId === userId);
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
