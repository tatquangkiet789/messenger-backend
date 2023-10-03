export type UserResponse = {
	id: number;
	firstName: string;
	lastName: string;
	avatar: string;
	tick: boolean;
	isFriendWithCurrentUser: boolean;
};

export type CurrentUserResponse = {
	id: number;
	firstName: string;
	lastName: string;
	username: string;
	userRoleId: number;
	avatar: string;
	tick: boolean;
	email: string;
};
