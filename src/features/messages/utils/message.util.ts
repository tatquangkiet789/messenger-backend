import MessageEntity from '../models/message.enity';
import MessageResponse from '../models/message.response';

export const sortMessageList = (messageList: MessageEntity[]) => {
    return messageList.sort((a: MessageEntity, b: MessageEntity) => {
        return a.createdDate.getTime() - b.createdDate.getTime();
    });
};

export const mapMessageResponse = (message: MessageEntity) => {
    const messageResponse: MessageResponse = {
        id: message.id,
        content: message.content,
        messageTypeId: message.messageTypeId,
        senderDetail: {
            id: message.senderId,
            avatar: message.senderDetail!.avatar,
        },
        receiverDetail: {
            id: message.receiverId,
            avatar: message.receiverDetail!.avatar,
        },
    };
    return messageResponse;
};
