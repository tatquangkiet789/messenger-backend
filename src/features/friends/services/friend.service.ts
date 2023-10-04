import UserEntity from '../../users/models/user.entity';
import FriendEntity from '../models/friend.entity';
import { FindAllFriendByUserId } from './friend-service.type';

export const findAllFriendsByUserIdService = async (param: FindAllFriendByUserId) => {
	try {
		const {
			currentUserId,
			page,
			findAllFriendsByUserIdRepository,
			findLastestMessageByUserIdRepository,
			filterCurrentUser,
			mapFriendResponse,
		} = param;

		const friendList: FriendEntity[] = await findAllFriendsByUserIdRepository({
			userId: currentUserId,
			includeUserDetail: true,
			page: page,
		});

		const filteredUserList: UserEntity[] = friendList.map((friend) =>
			filterCurrentUser({ friend, currentUserId }),
		);

		const lastestMessageList: string[] = await Promise.all(
			filteredUserList.map(async (user) => {
				const lastestMessage = await findLastestMessageByUserIdRepository({
					senderId: currentUserId,
					receiverId: user.id!,
				});
				return lastestMessage;
			}),
		);

		const result = filteredUserList.map((user: UserEntity, index: number) =>
			mapFriendResponse({ user: user, lastestMessage: lastestMessageList[index] }),
		);
		return result;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
