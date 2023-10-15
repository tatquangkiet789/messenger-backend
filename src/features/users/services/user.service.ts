import UserEntity from '../models/user.entity';
import { UserResponse } from '../models/user.response';
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
			findNotificationByUserIDRepository,
		} = param;

		const userList: UserEntity[] = await findAllUsersByKeywordRepository({
			keyword: keyword.toLowerCase().trim(),
		});
		// Lọc current user ra khỏi list
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
		// Lọc ra những user đã kết bạn với current user chỉ lấy những user chưa kết bạn
		const userNotFriendWithCurrentUserList = filterNotFriendWithCurrentUser({
			userList: filteredUserList,
			isFriendWithCurrentUserList,
		});
		// Check xem những user này đã gửi lời mời kết bạn chưa?
		const result = await Promise.all(
			userNotFriendWithCurrentUserList.map(async (user: UserResponse) => {
				const existedNotification = await findNotificationByUserIDRepository({
					senderID: user.id!,
					receiverID: currentUserID,
				});
				if (existedNotification) {
					return { ...user, isSentAddFriendNotification: true };
				}
				return user;
			}),
		);

		return result;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
