type UserDetail = {
	id: number;
	avatar: string;
	name: string;
};

export type ParentMessageResponse = {
	id: number;
	content: string;
	messageTypeId: number;
	senderDetail: {
		id: number;
		name: string;
	};
};

export type MessageResponse = {
	id: number;
	content: string;
	messageTypeId: number;
	senderDetail: UserDetail;
	receiverDetail: UserDetail;
	parentDetail: ParentMessageResponse | null;
};
