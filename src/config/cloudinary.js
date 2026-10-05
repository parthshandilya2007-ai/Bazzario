// Cloudinary and File Storage configuration service
import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };
export const isCloudinaryConfigured = () => {
  return (
    Boolean(env.CLOUDINARY_CLOUD_NAME) &&
    env.CLOUDINARY_CLOUD_NAME !== 'mock_cloud' &&
    Boolean(env.CLOUDINARY_API_KEY) &&
    Boolean(env.CLOUDINARY_API_SECRET)
  );
};
