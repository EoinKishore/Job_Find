
import { PutObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: process.env.AWS_REGION
});

export const uploadPdf = async (bucket: string, key: string): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: 'application/pdf'
  });

  try {
    return await getSignedUrl(s3, command, { expiresIn: 3600 });
  } catch (error: any) {
    throw new Error(`Failed to generate upload URL: ${error.message}`);
  }
};

export const downloadPdf = async (bucket: string, key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  });

  try {
    return await getSignedUrl(s3, command, { expiresIn: 3600 });
  } catch (error: any) {
    throw new Error(`Failed to generate download URL: ${error.message}`);
  }
};
