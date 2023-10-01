import { z } from 'zod';

const NotificationUserDetailValidate = z.object({
	id: z.number(),
	firstName: z.string().max(50).min(2),
	lastName: z.string().max(100).min(2),
	avatar: z.string().max(255),
});

export const NotificationEntityValidate = z.object({
	id: z.number().optional(),
	content: z.string(),
	accepted: z.boolean().default(false),
	deleted: z.boolean().default(false),
	createdDate: z.date().default(new Date()),
	notificationTypeId: z.number(),
	receiverId: z.number(),
	senderId: z.number(),
	notificationSenderDetail: NotificationUserDetailValidate,
	notificationReceiverDetail: NotificationUserDetailValidate,
});

type NotificationEntity = z.infer<typeof NotificationEntityValidate>;

export default NotificationEntity;
