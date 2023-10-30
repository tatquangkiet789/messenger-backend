import UserEntity, { DecodedUserEntity } from '../models/user.entity';
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

export function mapToDecodedUserEntity({ user }: { user: UserEntity }) {
	const decodedUser: DecodedUserEntity = {
		id: user.id!,
		firstName: user.firstName,
		lastName: user.lastName,
		username: user.username,
		userRoleId: user.userRoleId!,
		avatar: user.avatar!,
		tick: user.tick!,
	};
	return decodedUser;
}

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
	isSentAddFriendNotification,
}: {
	user: UserEntity;
	isFriendWithCurrentUser: boolean;
	isSentAddFriendNotification: boolean;
}) => {
	const userResponse: UserResponse = {
		id: user.id!,
		firstName: user.firstName,
		lastName: user.lastName,
		avatar: user.avatar!,
		tick: user.tick!,
		isFriendWithCurrentUser: isFriendWithCurrentUser,
		isSentAddFriendNotification: isSentAddFriendNotification,
	};
	return userResponse;
};

export const filterNotFriendWithCurrentUser = ({
	userList,
	isFriendWithCurrentUserList,
}: {
	userList: UserEntity[];
	isFriendWithCurrentUserList: boolean[];
}) => {
	const filteredList = userList.reduce<UserResponse[]>((result, user, index) => {
		if (!isFriendWithCurrentUserList[index]) {
			result.push(
				mapUserResponse({
					user,
					isFriendWithCurrentUser: isFriendWithCurrentUserList[index],
					isSentAddFriendNotification: false,
				}),
			);
		}
		return result;
	}, []);
	return filteredList;
};
