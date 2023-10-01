import cloudinary from '~/configs/cloudinary.config';
import { infoLogger, errorLogger } from './logger.util';

export const uploadImage = async (imagePath: string) => {
	try {
		infoLogger('Uploading image to Cloudinary in uploadImage');
		const result = await cloudinary.uploader.upload(imagePath);
		return result.secure_url;
	} catch (error) {
		console.error((error as Error).stack);
	}
};

export const uploadVideo = async (videoPath: string) => {
	try {
		infoLogger('Uploading video to Cloudinary in uploadVideo');
		const result = await cloudinary.uploader.upload(videoPath, {
			resource_type: 'video',
		});
		return result.secure_url;
	} catch (err) {
		errorLogger((err as Error).stack);
	}
};
