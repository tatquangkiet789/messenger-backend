export const NOTIFICATION_TYPE = {
	ADD_FRIEND: 1,
	LIKE: 2,
};

export const NOTIFICATION_MESSAGE = {
	ADD_FRIEND: 'đã gửi cho bạn lời mời kết bạn',
	ACCEPTED: 'đã chấp nhận lời mời kết bạn',
	DECLINED: 'đã từ chối lời mời kết bạn',
};

export const NOTIFICATION_SOCKET_EVENT = {
	SEND_ADD_FRIEND_NOTIFICATION: 'SEND_ADD_FRIEND_NOTIFICATION',
	SEND_ACCEPTED_ADD_FRIEND_NOTIFICATION: 'SEND_ACCEPTED_ADD_FRIEND_NOTIFICATION',
};
