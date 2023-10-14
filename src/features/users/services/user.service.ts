import UserEntity from '../models/user.entity';
import { FindAllUsersByKeyword, FindUserByIDSocket } from './user-service.type';

export const findUserByIDSocketService = async (param: FindUserByIDSocket) => {
	try {
		const { userID, findUserByIDRepository } = param;
		const user = await findUserByIDRepository({ userID });

		if (user) return user;

		throw new Error('User not found');
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const findAllUsersByKeywordService = async (param: FindAllUsersByKeyword) => {
	try {
		const {
			keyword,
			findAllUsersByKeywordRepository,
			filterCurrentUser,
			currentUserID,
			checkIfUsersAreFriendRepository,
			filterNotFriendWithCurrentUser,
		} = param;

		const userList: UserEntity[] = await findAllUsersByKeywordRepository({
			keyword: keyword.toLowerCase().trim(),
		});
		const filteredUserList = filterCurrentUser({ currentUserID, userList });

		const isFriendWithCurrentUserList: boolean[] = await Promise.all(
			filteredUserList.map(async (user: UserEntity) => {
				const isFriend = await checkIfUsersAreFriendRepository({
					currentUserID,
					userID: user.id!,
				});
				return isFriend;
			}),
		);

		const result = filterNotFriendWithCurrentUser({
			userList: filteredUserList,
			isFriendWithCurrentUserList,
		});

		return result;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
