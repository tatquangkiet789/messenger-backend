export const infoLogger = (message: string) => {
	const dateTime = new Date().toLocaleString('vi');
	console.info(`[INFO] [${dateTime}]\t${message}`);
};

export const errorLogger = (message?: string) => {
	const dateTime = new Date().toLocaleString('vi');
	console.error(`[ERROR] [${dateTime}]\t${message}`);
};
