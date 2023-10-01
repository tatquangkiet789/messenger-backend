import { USER_ROLE } from '~/constants/constant';
import { MESSAGES } from '~/constants/message.constant';
import { mapCurrentUserResponse } from '~/features/users/utils/user.util';
import UserEntity, { UserEntityValidate } from '../../users/models/user.entity';
import { FindCurrentUserByID, Login, Register, UpdatePassword } from './auth-service.type';

export const findCurrentUserByIDService = async (param: FindCurrentUserByID) => {
	try {
		const { userID, findUserByIDRepository } = param;

		const user: UserEntity = await findUserByIDRepository({ userID });
		const result = mapCurrentUserResponse({ user });

		return result;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const loginService = async (param: Login) => {
	try {
		const {
			username,
			password,
			findUserByUsernameRepository,
			comparePassword,
			generateAccessToken,
			generateRefreshToken,
		} = param;

		const user: UserEntity = await findUserByUsernameRepository({ username });
		if (!user) throw new Error(MESSAGES.usernameNotFound);

		const isMatched = await comparePassword(password, user.password!);
		if (!isMatched) throw new Error(MESSAGES.passwordNotMatched);

		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);

		return { accessToken, refreshToken };
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const updatePasswordService = async (param: UpdatePassword) => {
	try {
		const {
			username,
			password,
			newPassword,
			comparePassword,
			updatePasswordRepository,
			findUserByUsernameRepository,
			hashPasswod,
		} = param;
		const user: UserEntity = await findUserByUsernameRepository({ username });
		if (!user) throw new Error(MESSAGES.usernameNotFound);

		const isMatched = await comparePassword(password, user.password!);
		if (!isMatched) throw new Error(MESSAGES.passwordNotMatched);

		const hashed = await hashPasswod(newPassword, 10);
		const updatedUser = await updatePasswordRepository({
			username,
			hashed,
		});

		return updatedUser;
	} catch (err) {
		throw new Error((err as Error).message);
	}
};

export const registerSerivce = async (param: Register) => {
	try {
		const {
			avatar,
			createUserRepository,
			email,
			findUserByUsernameRepository,
			firstName,
			hashPasswod,
			lastName,
			password,
			username,
			uploadImageToCloudinary,
		} = param;

		const existed = await findUserByUsernameRepository({ username });
		if (existed) throw new Error(MESSAGES.usernameExisted);

		const user: UserEntity = {
			firstName,
			lastName,
			username,
			email: email,
			password,
			avatar,
			tick: false,
			userRoleId: USER_ROLE.USER,
		};

		const validatedUser = UserEntityValidate.safeParse(user);
		if (validatedUser.success) {
			validatedUser.data.password = await hashPasswod(password, 10);
			const uploadedImageURL = await uploadImageToCloudinary(avatar);
			validatedUser.data.avatar = uploadedImageURL!;
			const newUser = createUserRepository(validatedUser.data);
			return newUser;
		}

		throw new Error('Số kí tự không được vượt quá ngưỡng cho phép');
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
