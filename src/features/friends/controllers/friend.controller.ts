import { Request, Response } from 'express';
import { findLastestMessageByUserIdRepository } from '../../messages/repositories/message.repository';
import { findAllFriendsByUserIdRepository } from '../repositories/friend.repository';
import { findAllFriendsByUserIdService } from '../services/friend.service';
import { filterCurrentUser, mapFriendResponse } from '../utils/friend.util';

// [GET] /api/v1/friends
export const findAllFriendsController = async (req: Request, res: Response) => {
    try {
        const { id: userId } = req.currentUser;
        const page = req.query.page || 1;

        const result = await findAllFriendsByUserIdService({
            currentUserId: userId as number,
            page: page as number,
            findAllFriendsByUserIdRepository,
            filterCurrentUser,
            findLastestMessageByUserIdRepository,
            mapFriendResponse,
        });

        return res.status(200).send({ content: result });
    } catch (error) {
        return res.status(400).send({ message: (error as Error).message });
    }
};
