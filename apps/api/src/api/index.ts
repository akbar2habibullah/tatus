import { Elysia, t } from 'elysia';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import jwt from 'jsonwebtoken';
import DOMPurify from 'dompurify';
import { v4 as generateUUID } from 'uuid';
import { JWT_SECRET, S3_BUCKET_NAME } from '../../config'
import { producer } from '../kafka'
import { privateKey } from '../key'
import { s3, updateMetadataInS3 } from '../s3'

// --- Elysia App ---
const app = new Elysia()
  .decorate('s3', s3)
  .decorate('producer', producer)
  .decorate('privateKey', privateKey)
  .resolve(({ headers, error }) => {
    const token =  headers['authorization']
    
    if (!token) {
      return error(400)
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as  { email: string, name: string, picture: string, userId: string };
      return {
        user: decoded
      }; // Set user information in the context
    } catch (e) {
      return error(401)
    }
  })

// --- API Endpoints ---

// Get Signed URL for Upload (with authentication and validation)
app.post('/upload', async ({ body, s3, user, privateKey, error }) => {

  const file = body.file;
  const filename = body.filename;
  const description = body.description;

  // Sanitization:
  const sanitizedDescription = DOMPurify.sanitize(description || ''); // Sanitize the description if provided

  try {
    // --- Upload File to S3 ---

    // Generate a unique key for the file (e.g., using UUID)
    const fileKey = `uploads/${user.userId}/${generateUUID()}-${filename}`; 

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileKey,
      Body: file.stream(), // Assuming 'file' has a 'stream()' method
      ContentType: file.type,
    });

    await s3.send(command);

    // --- Create and Sign Metadata ---
    const metadata = {
      filename,
      description: sanitizedDescription,
      userId: user.userId,
      uploadDate: new Date().toISOString(),
    };

    await updateMetadataInS3(`${user.userId}/${fileKey}`, metadata, await privateKey());

    // --- Return Success Response ---
    return { success: true, fileKey };

  } catch (e) {
    console.error('Error uploading file:', e);
    return error(500)
  }
}, {
  body: t.Object({
    file: t.File({
      type: [
        'image/jpeg',
        'image/png',
        'image/webp',
      ],
      maxSize: '5m', // Maximum file size in bytes or using size units like '500m' for 500 megabytes
    }),
    filename: t.String(),
    description: t.String()
  }),
});

// Update Metadata (with authentication and validation)
app.post('/metadata/:address', async ({ body, producer, params, user, error }) => {

  const { metadataType } = body

  // Send to Kafka:
  try {
    await producer.send({
      topic: 'metadata-updates',
      messages: [
        { value: JSON.stringify({ userAddress: params.address, metadataType, userId: user.userId }) }, // Include userId
      ],
    });
    return { success: true }; 
  } catch (e) {
    console.error('Error sending message to Kafka:', e);
    return error(500)
  }
}, {
  body: t.Object({
    metadataType: t.Enum({'view': 'view', 'download': 'download', 'like': 'like'}),
    increment: t.Number()
  }),
});

export const apiRoute = app;