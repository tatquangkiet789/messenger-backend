import { PrismaClient } from '@prisma/client';
import { PAGE_SIZE } from '~/constants/constant';
import { MESSAGES } from '~/constants/message.constant';

const prisma = new PrismaClient();

export const findAllFriendsByUserIdRepository = async ({
	userId,
	page,
}: {
	userId: number;
	page: number;
}) => {
	try {
		const offset = (page! - 1) * PAGE_SIZE;
		const friendList = await prisma.friend.findMany({
			where: {
				OR: [
					{
						firstUserId: userId,
					},
					{
						secondUserId: userId,
					},
				],
				deleted: false,
			},
			skip: offset,
			take: PAGE_SIZE,
			include: {
				firstUserDetail: true,
				secondUserDetail: true,
			},
		});
		return friendList;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const checkIfUsersAreFriendRepository = async ({
	currentUserID,
	userID,
}: {
	currentUserID: number;
	userID: number;
}) => {
	try {
		const isFriend = await prisma.friend.findFirst({
			where: {
				OR: [
					{
						firstUserId: currentUserID,
						secondUserId: userID,
					},
					{
						firstUserId: userID,
						secondUserId: currentUserID,
					},
				],
				deleted: false,
			},
		});

		if (isFriend) return true;

		return false;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const createFriendRepository = async ({
	currentUserId,
	userId,
}: {
	currentUserId: number;
	userId: number;
}) => {
	try {
		const result = await prisma.friend.create({
			data: {
				createdDate: new Date(),
				deleted: false,
				firstUserId: currentUserId,
				secondUserId: userId,
			},
			include: {
				firstUserDetail: true,
				secondUserDetail: true,
			},
		});
		if (result) return result;

		throw new Error(MESSAGES.unknowError);
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

// findFriendIdByFristUserIdAndSecondUserId = async (friendDTO: IFriendDTO) => {
//     try {
//         const { firstUserId, secondUserId } = friendDTO;
//         this.logger.info(
//             `Checking if friendId by firstUserId: [${firstUserId}] and secondUserId: [${secondUserId}] is existed in friendService:findFriendIdByFristUserIdAndSecondUserId`,
//         );
//         const friend = await prisma.friend.findFirst({
//             where: {
//                 OR: [
//                     {
//                         firstUserId: firstUserId,
//                         secondUserId: secondUserId,
//                     },
//                     {
//                         firstUserId: secondUserId,
//                         secondUserId: firstUserId,
//                     },
//                 ],
//             },
//         });
//         return friend?.id;
//     } catch (err) {
//         this.logger.error((err as Error).stack);
//         throw new Error((err as Error).message);
//     }
// };

// userAddNewFriend = async (friendDTO: IFriendDTO) => {
//     try {
//         const friendId = await this.findFriendIdByFristUserIdAndSecondUserId(
//             friendDTO,
//         );
//         if (friendId) {
//             this.logger.info(
//                 `UserId: [${friendDTO.firstUserId}] re-adding friend with userId: [${friendDTO.secondUserId}] in friendController:userAddNewFriend`,
//             );
//             const result = await this.createNewFriendAfterUnfriend(friendId);
//             return result;
//         }
//         this.logger.info(
//             `UserId: [${friendDTO.firstUserId}] adding new friend with userId: [${friendDTO.secondUserId}] in friendController:userAddNewFriend`,
//         );
//         const result = await this.createNewFriend(friendDTO);
//         return result;
//     } catch (err) {
//         this.logger.error((err as Error).stack);
//         throw new Error((err as Error).message);
//     }
// };

// createNewFriendAfterUnfriend = async (friendId: number) => {
//     try {
//         this.logger.info(
//             `Updating deletedDate to null by friendId: [${friendId}] in friendController:createNewFriendAfterUnfriend`,
//         );
//         const result = await prisma.friend.update({
//             where: {
//                 id: friendId,
//             },
//             data: {
//                 deletedDate: null,
//             },
//         });
//         if (result) return result;

//         throw new Error(MESSAGES.unknowError);
//     } catch (err) {
//         this.logger.error((err as Error).stack);
//         throw new Error((err as Error).message);
//     }
// };
