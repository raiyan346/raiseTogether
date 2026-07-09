import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};

export const uploadToCloudinary = (buffer, folder = 'risetogether') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    bufferToStream(buffer).pipe(stream);
  });

export const deleteFromCloudinary = (publicId) =>
  cloudinary.uploader.destroy(publicId);
