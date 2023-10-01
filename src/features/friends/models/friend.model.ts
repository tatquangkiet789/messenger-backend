export interface IFindFriend {
    firstUserId?: number;
    secondUserId?: number;
    userId?: number;
    includeUserDetail: boolean;
    page?: number;
}

export interface IFriendResponse {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    avatar: string;
    tick: boolean;
    lastestMessage: {
        content: string;
        messageTypeId: number;
    };
}
