import UserEntity from '../models/user.entity';
import { CurrentUserResponse, UserResponse } from '../models/user.response';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type FindUserByID = {
	userID: number;
	findUserByIDRepository: ({ userID }: { userID: number }) => Promise<any>;
	mapCurrentUserResponse: ({ user }: { user: UserEntity }) => CurrentUserResponse;
};

export type FindAllUsersByKeyword = {
	keyword: string;
	currentUserID: number;
	findAllUsersByKeywordRepository: ({ keyword }: { keyword: string }) => Promise<any>;
	mapUserResponse: ({
		user,
		isFriendWithCurrentUser,
	}: {
		user: UserEntity;
		isFriendWithCurrentUser: boolean;
	}) => UserResponse;
	filterCurrentUser: ({
		currentUserID,
		userList,
	}: {
		currentUserID: number;
		userList: UserEntity[];
	}) => UserEntity[];
	checkIfUsersAreFriendRepository: ({
		currentUserID,
		userID,
	}: {
		currentUserID: number;
		userID: number;
	}) => Promise<boolean>;
};
