import multer from 'multer';
import crypto from 'crypto';
import { resolve, extname } from 'path';
import multerS3 from 'multer-s3';

import storageS3 from '../lib/S3';
import awsConfig from './aws';

const generateKey = (req, file, cb) => {
  crypto.randomBytes(16, (err, hash) => {
    if (err) cb(err);

    const filename = hash.toString('hex') + extname(file.originalname);

    cb(null, filename);
  });
};

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, resolve(__dirname, '..', '..', 'tmp', 'uploads'));
    },
    filename: generateKey,
  }),

  s3: multerS3({
    s3: storageS3,
    bucket: awsConfig.bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'private',
    key: generateKey,
  }),
};

export default {
  dest: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  storage: storageTypes[process.env.STORAGE || 'local'],
  limits: { fileSize: process.env.FILE_SIZE_LIMIT * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/pjpeg',
      'image/jpg',
    ];

    if (allowedMimes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'));
  },
};
