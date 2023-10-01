type UserDetail = {
	id: number;
	avatar: string;
};

export type MessageResponse = {
	id: number;
	content: string;
	messageTypeId: number;
	senderDetail: UserDetail;
	receiverDetail: UserDetail;
};
