const { AWS_S3_KEY, AWS_S3_SECRET, AWS_S3_REGION, AWS_S3_BUCKET } = process.env;

export default {
  s3: {
    credentials: {
      accessKeyId: AWS_S3_KEY,
      secretAccessKey: AWS_S3_SECRET
    },
    region: AWS_S3_REGION,
    httpOptions: {
      timeout: 90000
    },
    params: {
      ACL: 'public-read',
      Bucket: AWS_S3_BUCKET
    }
  }
};
