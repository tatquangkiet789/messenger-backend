import UserEntity from '../models/user.entity';
import { CurrentUserResponse, UserResponse } from '../models/user.response';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type FindUserByID = {
	userID: number;
	findUserByIDRepository: ({ userID }: { userID: number }) => Promise<any>;
	mapCurrentUserResponse: ({ user }: { user: UserEntity }) => CurrentUserResponse;
};

export type FindUserByIDSocket = {
	userID: number;
	findUserByIDRepository: ({ userID }: { userID: number }) => Promise<any>;
};

export type FindAllUsersByKeyword = {
	keyword: string;
	currentUserID: number;
	findAllUsersByKeywordRepository: ({ keyword }: { keyword: string }) => Promise<any>;
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
	filterNotFriendWithCurrentUser: ({
		userList,
		isFriendWithCurrentUserList,
	}: {
		userList: UserEntity[];
		isFriendWithCurrentUserList: boolean[];
	}) => UserResponse[];
};
