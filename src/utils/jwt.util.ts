import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedUserEntity } from '~/features/users/models/user.entity';
import { MESSAGES } from '../constants/message.constant';

// Generate Access Token
export const generateAccessTokenUtil = (user: DecodedUserEntity) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN!, {
			expiresIn: '1h',
		});
		return accessToken;
	} catch (err) {
		throw new Error((err as Error).message);
	}
};

// Generate Refresh Token
export const generateRefreshTokenUtil = (user: DecodedUserEntity) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN!);

		return refreshToken;
	} catch (err) {
		throw new Error((err as Error).message);
	}
};

// Save Refresh Token in HttpOnly Cookie
export const saveTokenToCookieUtil = (res: Response, refreshToken: string) => {
	try {
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: false,
			path: '/',
			maxAge: 3600000,
		});
	} catch (err) {
		throw new Error((err as Error).message);
	}
};

export const verifyAccessTokenTokenUtil = (accessToken: string) => {
	try {
		const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN!);

		if (typeof decoded === 'string') throw new Error(MESSAGES.accessTokenNotFound);
		return decoded;
	} catch (err) {
		throw new Error((err as Error).message);
	}
};

export const verifyRefreshTokenTokenUtil = (refreshToken: string) => {
	try {
		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN!);

		if (typeof decoded === 'string') throw new Error(MESSAGES.refreshTokenNotFound);
		return decoded;
	} catch (err) {
		throw new Error((err as Error).message);
	}
};
