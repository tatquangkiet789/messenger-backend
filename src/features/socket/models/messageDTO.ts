export interface IReceiveMessage {
    senderName: string;
    receiverName: string;
    content: string;
}

export interface ISendMessage {
    id?: number;
    senderDetail: {
        id: number;
        avatar: string;
    };
    content?: string;
}
