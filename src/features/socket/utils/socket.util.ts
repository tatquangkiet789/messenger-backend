// import { infoLogger, errorLogger } from '@/src/utils/logger.util';
// import { IConnectedUser } from '../models/connectedUser.model';

// import { infoLogger } from '@/src/utils/logger.util';

// let connectedUserList: IConnectedUser[] = [];

// export const addNewConnectedUserUtil = (connectedUser: IConnectedUser) => {
//     try {
//         infoLogger(
//             `Checking if ${connectedUser.username} is existed in addNewConnectedUserUtil`,
//         );
//         const existedSocket = connectedUserList.find(
//             (user) => user.socketId === connectedUser.socketId,
//         );
//         if (existedSocket) return;

//         const existedUser = connectedUserList.find(
//             (user) => user.username === connectedUser.username,
//         );

//         if (existedUser) {
//             infoLogger(
//                 `Updating connected user with new socketId: [${connectedUser.socketId}] in addNewConnectedUserUtil`,
//             );
//             existedUser.socketId = connectedUser.socketId;
//         } else {
//             infoLogger(
//                 `Adding new connected user with username: ${connectedUser.username} in addNewConnectedUserUtil`,
//             );
//             connectedUserList = [...connectedUserList, connectedUser];
//         }
//         console.log(connectedUserList);
//     } catch (err) {
//         errorLogger((err as Error).stack);
//     }
// };

// export const removeConnectedUserUtil = (connectedUser: IConnectedUser) => {
//     try {
//         const { socketId } = connectedUser;
//         infoLogger(
//             `Removing connected user with socketId: ${socketId} in removeConnectedUserUtil`,
//         );
//         connectedUserList = [...connectedUserList].filter(
//             (user) => user.socketId !== socketId,
//         );
//         console.log(connectedUserList);
//     } catch (err) {
//         errorLogger((err as Error).stack);
//     }
// };

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
