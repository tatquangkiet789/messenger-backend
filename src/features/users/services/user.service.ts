import UserEntity from '../models/user.entity';
import { FindAllUsersByKeyword } from './user-service.type';

export const findAllUsersByKeywordService = async (param: FindAllUsersByKeyword) => {
	try {
		const {
			keyword,
			findAllUsersByKeywordRepository,
			filterCurrentUser,
			currentUserID,
			checkIfUsersAreFriendRepository,
			mapUserResponse,
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

		const result = filteredUserList.map((user: UserEntity, index: number) =>
			mapUserResponse({ user, isFriendWithCurrentUser: isFriendWithCurrentUserList[index] }),
		);

		return result;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
