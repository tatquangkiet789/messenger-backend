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
			connectedUserList[existedUser.userId].socketId = connectedUser.socketId;
		} else {
			connectedUserList = [...connectedUserList, connectedUser];
		}

		console.log(connectedUserList);
	} catch (error) {
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
