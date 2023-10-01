import UserEntity from '~/features/users/models/user.entity';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type FindCurrentUserByID = {
	userID: number;
	findUserByIDRepository: ({ userID }: { userID: number }) => Promise<any>;
};

export type Login = {
	username: string;
	password: string;
	findUserByUsernameRepository: ({ username }: { username: string }) => Promise<any>;
	comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
	generateAccessToken: (user: UserEntity) => string;
	generateRefreshToken: (user: UserEntity) => string;
};

export type UpdatePassword = {
	username: string;
	password: string;
	newPassword: string;
	comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
	findUserByUsernameRepository: ({ username }: { username: string }) => Promise<any>;
	updatePasswordRepository: ({
		username,
		hashed,
	}: {
		username: string;
		hashed: string;
	}) => Promise<any>;
	hashPasswod: (passwod: string, salt: number) => Promise<string>;
};

export type Register = {
	firstName: string;
	lastName: string;
	username: string;
	password: string;
	email: string;
	avatar: string;
	findUserByUsernameRepository: ({ username }: { username: string }) => Promise<any>;
	createUserRepository: (user: UserEntity) => Promise<any>;
	hashPasswod: (passwod: string, salt: number) => Promise<string>;
	uploadImageToCloudinary: (image: string) => Promise<string | undefined>;
};
