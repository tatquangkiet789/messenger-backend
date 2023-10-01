import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { MESSAGES } from '~/constants/message.constant';
import {
	createUserRepository,
	findUserByIDRepository,
	findUserByUsernameRepository,
	updatePasswordRepository,
} from '~/features/users/repositories/user.repository';
import { uploadImage } from '~/utils/cloudinary.util';
import {
	generateAccessTokenUtil,
	generateRefreshTokenUtil,
	saveTokenToCookieUtil,
	verifyRefreshTokenTokenUtil,
} from '~/utils/jwt.util';
import {
	findCurrentUserByIDService,
	loginService,
	registerSerivce,
	updatePasswordService,
} from '../services/auth.service';

// [POST] /api/v1/auth/current-user
export const findCurrentUserByAccessTokenController = async (req: Request, res: Response) => {
	try {
		const { id: userID } = req.currentUser;

		const result = await findCurrentUserByIDService({
			userID,
			findUserByIDRepository,
		});

		return res.status(200).send({ content: result });
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}
};

// [POST] /api/v1/auth/login
export const loginController = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body;

		const result = await loginService({
			username,
			password,
			comparePassword: bcrypt.compare,
			findUserByUsernameRepository,
			generateAccessToken: generateAccessTokenUtil,
			generateRefreshToken: generateRefreshTokenUtil,
		});

		saveTokenToCookieUtil(res, result.refreshToken);

		return res.status(200).send({ accessToken: result.accessToken });
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}
};

// [POST] /api/v1/auth/register
export const registerController = async (req: Request, res: Response) => {
	try {
		const { firstName, lastName, username, password, email } = req.body;
		const avatar = req.file!.path;

		const result = await registerSerivce({
			avatar,
			firstName,
			lastName,
			username,
			password,
			email,
			createUserRepository,
			findUserByUsernameRepository,
			uploadImageToCloudinary: uploadImage,
			hashPasswod: bcrypt.hash,
		});

		if (result) return res.status(201).send({ message: MESSAGES.registerSuccessfully });

		throw new Error(MESSAGES.unknowError);
	} catch (err) {
		res.status(400).send({ message: (err as Error).message });
	}
};

// [POST] /api/v1/auth/update-password
export const updatePasswordController = async (req: Request, res: Response) => {
	try {
		const { username } = req.currentUser;
		const { password, newPassword } = req.body;

		const result = await updatePasswordService({
			username,
			password,
			newPassword,
			comparePassword: bcrypt.compare,
			hashPasswod: bcrypt.hash,
			findUserByUsernameRepository,
			updatePasswordRepository,
		});

		if (result) return res.status(200).send({ message: MESSAGES.updatePasswordSuccessfully });

		throw new Error(MESSAGES.unknowError);
	} catch (err) {
		res.status(400).send({ message: (err as Error).message });
	}
};

// [POST] /api/v1/auth/refresh-token
export const refreshTokenController = async (req: Request, res: Response) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { iat, ...user } = req.currentUser;
		// Create JWT Token
		const newAccessToken = generateAccessTokenUtil(user);
		const newRefreshToken = generateRefreshTokenUtil(user);

		saveTokenToCookieUtil(res, newRefreshToken);

		return res.status(200).send({
			content: newAccessToken,
		});
	} catch (err) {
		return res.status(400).send({ message: (err as Error).message });
	}
};

// [POST] /api/v1/auth/logout
export const logoutUserController = (req: Request, res: Response) => {
	try {
		const { refreshToken } = req.cookies;
		if (!refreshToken) throw new Error(MESSAGES.refreshTokenNotFound);

		const decoded = verifyRefreshTokenTokenUtil(refreshToken);
		if (decoded) res.clearCookie('refreshToken', { httpOnly: true });

		return res.status(200).send({ message: MESSAGES.logoutSuccessfully });
	} catch (err) {
		return res.status(400).send({ message: (err as Error).message });
	}
};
