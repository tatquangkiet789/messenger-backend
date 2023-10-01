import { PrismaClient } from '@prisma/client';
import { MESSAGES } from '~/constants/message.constant';
import UserEntity from '../models/user.entity';
import { USER_ROLE } from '~/constants/constant';

const prisma = new PrismaClient();

export const findUserByIDRepository = async ({ userID }: { userID: number }) => {
	try {
		const user = await prisma.user.findFirst({
			where: {
				id: userID,
				deletedDate: null,
			},
		});
		if (user) return user;

		throw new Error(MESSAGES.userNotFound);
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const findUserByUsernameRepository = async ({ username }: { username: string }) => {
	try {
		const user = await prisma.user.findFirst({
			where: {
				username: username,
				deletedDate: null,
			},
		});
		return user;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const updatePasswordRepository = async ({
	username,
	hashed,
}: {
	username: string;
	hashed: string;
}) => {
	try {
		const user = await prisma.user.update({
			where: {
				username: username,
			},
			data: {
				password: hashed,
			},
		});
		return user;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const createUserRepository = async (user: UserEntity) => {
	try {
		const { firstName, lastName, email, avatar, password: hashed, username } = user;
		const newUser = await prisma.user.create({
			data: {
				firstName,
				lastName,
				username,
				password: hashed!,
				email,
				avatar: avatar!,
				userRoleId: USER_ROLE.USER,
				createdDate: new Date(),
				tick: false,
				deletedDate: null,
			},
		});
		if (newUser) return newUser;

		throw new Error(MESSAGES.unknowError);
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const findAllUsersByKeywordRepository = async ({ keyword }: { keyword: string }) => {
	try {
		const userList = await prisma.user.findMany({
			where: {
				deletedDate: null,
				OR: [
					{
						firstName: {
							contains: keyword,
						},
					},
					{
						lastName: {
							contains: keyword,
						},
					},
				],
				userRoleId: USER_ROLE.USER,
			},
		});
		return userList;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
