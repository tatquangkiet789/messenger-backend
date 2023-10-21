import { DecodedUserEntity } from '~/features/users/models/user.entity';

declare global {
	namespace Express {
		interface Request {
			currentUser: DecodedUserEntity;
		}
	}
}
