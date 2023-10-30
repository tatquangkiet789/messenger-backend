import { z } from 'zod';
import { USER_ROLE } from '~/constants/constant';

export const UserEntityValidate = z.object({
	id: z.number().optional(),
	firstName: z.string().max(50).min(2),
	lastName: z.string().max(100).min(2),
	username: z.string().max(50).min(3),
	password: z.string().max(100).min(3),
	email: z.string().email(),
	avatar: z.string().max(255),
	tick: z.boolean().default(false),
	userRoleId: z.number().default(USER_ROLE.USER),
});

export type DecodedUserEntity = {
	id: number;
	firstName: string;
	lastName: string;
	username: string;
	avatar: string;
	tick: boolean;
	userRoleId: number;
	iat?: number;
};

type UserEntity = z.infer<typeof UserEntityValidate>;

export default UserEntity;
