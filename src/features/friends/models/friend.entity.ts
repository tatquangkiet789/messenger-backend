import Joi from 'joi';
import UserEntity from '../../users/models/user.entity';

type FriendEntity = {
    id: number;
    firstUserId: number;
    secondUserId: number;
    firstUserDetail?: UserEntity;
    secondUserDetail?: UserEntity;
};

export const friendEntityValidate = Joi.object<FriendEntity>({});

export default FriendEntity;
