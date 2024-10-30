import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import jwt from 'jsonwebtoken';
import { S3_BUCKET_NAME, S3_REGION } from '../../config'

export const s3 = new S3Client({ 
  region: S3_REGION, 
  credentials: { 
    accessKeyId: 'YOUR_ACCESS_KEY_ID', 
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  }
});

// --- Helper Functions for S3 Interaction ---

export async function getMetadataFromS3(userAddress: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: `${userAddress}/metadata.json`, // Assuming metadata is stored as a JSON file
    });
    const response = await s3.send(command);

    // Parse and return metadata from S3 object
    const metadata = await response!.Body!.transformToString();

    return JSON.parse(metadata); 
  } catch (error) {
      console.error(`Error retrieving metadata for ${userAddress}:`, error);
      throw error; // Re-throw the error to be handled by the calling function
  }
}

export async function updateMetadataInS3(userAddress: string, metadata: any, privateKey: string) {
  try {
    // --- Sign the metadata using RS256 ---
    const token = jwt.sign(metadata, privateKey, { algorithm: 'RS256' });
    const signedMetadata = JSON.stringify({ data: metadata, signature: token });

    // --- Upload to S3 ---
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: `${userAddress}/metadata.json`,
      Body: signedMetadata,
      ContentType: 'application/json', 
    });
    await s3.send(command);

    console.log(`Metadata for ${userAddress} updated successfully`);
  } catch (error) {
    console.error(`Error updating metadata for ${userAddress}:`, error);
    throw error; 
  }
}