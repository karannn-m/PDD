import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock_access_key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock_secret_key'
  }
});

export const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'florascan-scans';

/**
 * Upload buffer to S3 bucket
 */
export const uploadBufferToS3 = async (fileBuffer, s3Key, mimeType) => {
  // If S3 credentials are dummy in local development, return simulated CDN URL
  if (process.env.NODE_ENV === 'development' && (!process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID === 'your_aws_access_key')) {
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${s3Key}`;
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: 'public-read'
  });

  await s3Client.send(command);
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${s3Key}`;
};

/**
 * Generate Presigned Download URL for private reports or scans
 */
export const getPresignedDownloadUrl = async (s3Key, expiresInSeconds = 3600) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key
  });
  return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
};
