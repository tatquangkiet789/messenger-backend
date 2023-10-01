import UserEntity from '../models/user.entity';
import { CurrentUserResponse, UserResponse } from '../models/user.response';

export const filterCurrentUser = ({
	currentUserID,
	userList,
}: {
	currentUserID: number;
	userList: UserEntity[];
}) => {
	const filteredList: UserEntity[] = userList.filter((user) => user.id !== currentUserID);
	return filteredList;
};

export const mapCurrentUserResponse = ({ user }: { user: UserEntity }) => {
	const currentUserResposne: CurrentUserResponse = {
		id: user.id!,
		firstName: user.firstName,
		lastName: user.lastName,
		username: user.username,
		userRoleId: user.userRoleId!,
		avatar: user.avatar!,
		tick: user.tick!,
		email: user.email,
	};

	return currentUserResposne;
};

export const mapUserResponse = ({
	user,
	isFriendWithCurrentUser,
}: {
	user: UserEntity;
	isFriendWithCurrentUser: boolean;
}) => {
	const userResponse: UserResponse = {
		id: user.id!,
		firstName: user.firstName,
		lastName: user.lastName,
		username: user.username,
		avatar: user.avatar!,
		tick: user.tick!,
		isFriendWithCurrentUser: isFriendWithCurrentUser,
	};
	return userResponse;
};
