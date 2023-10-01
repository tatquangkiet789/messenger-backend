import { Request, Response } from 'express';
import { findAllUsersByKeywordService } from '../services/user.service';
import { checkIfUsersAreFriendRepository } from '~/features/friends/repositories/friend.repository';
import { findAllUsersByKeywordRepository } from '../repositories/user.repository';
import { filterCurrentUser, mapUserResponse } from '../utils/user.util';

// [POST] /api/v1/users/search?q=:q
export const findAllUsersByKeywordController = async (req: Request, res: Response) => {
	try {
		const { id: userID } = req.currentUser;
		const { q } = req.query;

		const result = await findAllUsersByKeywordService({
			currentUserID: userID,
			keyword: q as string,
			checkIfUsersAreFriendRepository,
			filterCurrentUser,
			findAllUsersByKeywordRepository,
			mapUserResponse,
		});

		return res.status(200).send({ content: result });
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}
};
