type ConnectedUser = {
	userId: number;
	socketId: string;
};

let connectedUserList: ConnectedUser[] = [];

export const createConnectedUser = (connectedUser: ConnectedUser) => {
	try {
		const existedSocket = connectedUserList.find(
			(user) => user.socketId === connectedUser.socketId,
		);
		if (existedSocket) return;

		const existedUserIndex = connectedUserList.findIndex(
			(user) => user.userId === connectedUser.userId,
		);
		if (existedUserIndex >= 0) {
			connectedUserList[existedUserIndex].socketId = connectedUser.socketId;
			console.log(connectedUserList);
			return;
		}

		connectedUserList = [...connectedUserList, connectedUser];

		console.log(connectedUserList);
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const findConnectedUserByUserId = ({ userId }: { userId: number }) => {
	try {
		return connectedUserList.find((user: ConnectedUser) => user.userId === userId);
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
