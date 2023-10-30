import UserEntity from '../../users/models/user.entity';

type MessageEntity = {
	id: number;
	content: string;
	messageTypeId: number;
	senderId: number;
	receiverId: number;
	senderDetail?: UserEntity;
	receiverDetail?: UserEntity;
	createdDate: Date;
	parentMessageDetail?: MessageEntity;
};

export default MessageEntity;
