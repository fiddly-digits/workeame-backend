import multer from 'multer';
import AWS from 'aws-sdk';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import config from '../utils/utils.s3.config.js';
import crypto from 'crypto';

AWS.config.update({
  accessKeyId: config.s3.credentials.accessKeyId,
  secretAccessKey: config.s3.credentials.secretAccessKey,
  region: config.s3.region
});

const s3Client = new S3Client(config.s3);

const multerS3Config = multerS3({
  s3: s3Client,
  bucket: config.s3.params.Bucket,
  acl: config.s3.params.ACL,
  metadata: function (req, file, cb) {
    cb(null, Date.now().toString() + '-' + file.originalname);
  },
  key: function (req, file, cb) {
    cb(
      null,
      Date.now().toString() +
        '-' +
        crypto.randomBytes(5).toString('hex') +
        '.' +
        file.originalname.split('.')[1]
    );
  }
});

export const upload = multer({
  storage: multerS3Config,
  limits: { fileSize: 1000000 }
});

export const multi_upload = multer({
  storage: multerS3Config,
  limits: { fileSize: 1000000 }
}).array('images', 5);
