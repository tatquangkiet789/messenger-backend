export type AddFriendNotificationResponse = {
    id: number;
    content: string;
    notificationTypeId: number;
    notificationSenderDetail: {
        firstName: string;
        lastName: string;
        avatar: string;
    };
};
