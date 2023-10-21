import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedUserEntity } from '~/features/users/models/user.entity';
import { errorLogger } from '../utils/logger.util';

export const verifyAccessTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const accessToken = req.headers.authorization?.split(' ')[1];
	try {
		if (!accessToken) throw new Error('Vui lòng đăng nhập để tiếp tục');

		jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN!,
			(err: jwt.VerifyErrors | null, decodedUser: string | jwt.JwtPayload | undefined) => {
				if (err) throw new Error(err.message);
				req.currentUser = decodedUser as DecodedUserEntity;
				next();
			},
		);
	} catch (err) {
		errorLogger((err as Error).stack);
		return res.status(403).send({ message: (err as Error).message });
	}
};

export const verifyRefreshTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
	try {
		const { refreshToken } = req.cookies;
		if (!refreshToken) throw new Error('Không tìm thấy Refresh Token. Vui lòng đăng nhập lại!');

		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN!,
			(err: jwt.VerifyErrors | null, decodedUser: string | jwt.JwtPayload | undefined) => {
				if (err) throw new Error(err.message);
				req.currentUser = decodedUser as DecodedUserEntity;
				next();
			},
		);
	} catch (err) {
		errorLogger((err as Error).stack);
		return res.status(403).send({ message: (err as Error).message });
	}
};
