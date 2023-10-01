export type FriendResponse = {
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
};
