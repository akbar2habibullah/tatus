import { Elysia, t } from 'elysia';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Kafka, EachMessagePayload } from 'kafkajs';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import DOMPurify from 'dompurify';
import { v4 as generateUUID } from 'uuid';

// --- Configuration ---
const S3_REGION = 'your-s3-region';
const S3_BUCKET_NAME = 'your-bucket-name';
const KAFKA_BROKERS = ['kafka-broker1:9092', 'kafka-broker2:9092']; // Replace with your Kafka broker addresses
const METADATA_UPDATE_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your Google Client ID
const JWT_SECRET = 'YOUR_JWT_SECRET'; // Replace with a strong, randomly generated secret

// --- Google Cloud KMS Setup ---
const projectId = 'your-gcp-project-id'; // Replace with your GCP project ID
const secretName = 'projects/your-gcp-project-id/secrets/my-private-key/versions/latest'; // Replace with your secret's full name

const kmsClient = new SecretManagerServiceClient(); 
const privateKey = await (async () => {
  try {
    const [accessResponse] = await kmsClient.accessSecretVersion({
      name: secretName,
    });

    const responsePayload = accessResponse!.payload!.data!.toString();
    return responsePayload;
  } catch (error) {
    console.error('Error accessing secret from Google Cloud KMS:', error);
    throw error; 
  }
})()

// --- Initialize Services ---
const kafka = new Kafka({ clientId: 'my-app', brokers: KAFKA_BROKERS });
const producer = kafka.producer();
await producer.connect();

const s3 = new S3Client({ 
  region: S3_REGION, 
  credentials: { 
    accessKeyId: 'YOUR_ACCESS_KEY_ID', 
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  }
});

const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID);

// --- Elysia App ---
const app = new Elysia()
  .decorate('s3', s3)
  .decorate('kafka', kafka)
  .decorate('producer', producer)
  .decorate('oauth2Client', oauth2Client)
  .decorate('privateKey', privateKey)
  .post('/auth/google', async ({ request, oauth2Client }) => { 
    // Authentication (Google OAuth)
    try {
      const { tokenId } = await request.json();
  
      const ticket = await oauth2Client.verifyIdToken({
        idToken: tokenId,
        audience: GOOGLE_CLIENT_ID, 
      });
      const payload = ticket.getPayload();
  
      // Extract user information
      const { email, name, picture } = payload;
  
      // Generate JWT (you can include more data in the payload if needed)
      const token = jwt.sign({ email, name, picture, userId: email.split('@')[0] }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
  
      return { token }; 
    } catch (error) {
      console.error('Error verifying Google ID token:', error);
      return new Response('Authentication failed.', { status: 401 });
    }
  })
  .derive(({ headers, error }) => {
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
  });

// --- API Endpoints ---

// Get Signed URL for Upload (with authentication and validation)
app.post('/upload', async ({ body, s3, user, privateKey }) => {

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

    await updateMetadataInS3(`${user.userId}/${fileKey}`, metadata, privateKey);

    // --- Return Success Response ---
    return { success: true, fileKey };

  } catch (error) {
    console.error('Error uploading file:', error);
    return new Response('Error uploading file', { status: 500 });
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
app.post('/metadata/:address', async ({ body, producer, params, user }) => {

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
  } catch (error) {
    console.error('Error sending message to Kafka:', error);
    return { success: false, error: 'Failed to update metadata.' };
  }
},  {
  body: t.Object({
    metadataType: t.Enum({'view': 'view', 'download': 'download', 'like': 'like'}),
    increment: t.Number()
  }),
});

// --- Helper Functions for S3 Interaction ---

async function getMetadataFromS3(userAddress: string) {
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

async function updateMetadataInS3(userAddress: string, metadata: any, privateKey: string) {
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

// --- Background Worker (consumes messages from Kafka and updates S3) ---

const consumer = kafka.consumer({ groupId: 'metadata-group' });
await consumer.connect();
await consumer.subscribe({ topic: 'metadata-updates' });

const processedUpdates = new Set(); // Store processed updates in the current hour

// Function to generate a unique key for tracking updates
function getUpdateKey(userId: string, address: string, metadataType: string) {
  return `${userId}-${address}-${metadataType}`;
}

// Helper function to retrieve and update metadata (You'll need to implement this)
async function processMetadataUpdate(userAddress: string, metadataType: string, userId: string) {
  const updateKey = getUpdateKey(userId, userAddress, metadataType);

  if (processedUpdates.has(updateKey)) {
    console.log(`User ${userId} has already updated ${metadataType} for ${userAddress} in this hour.`);
    return; // Skip the update
  }

  try {
    const metadata = await getMetadataFromS3(userAddress); 
    metadata[metadataType] = (metadata[metadataType] || 0) + 1;

    await updateMetadataInS3(userAddress, metadata, privateKey); 

    processedUpdates.add(updateKey);
  } catch (error) {
    console.error(`Error updating metadata for ${userAddress}:`, error);
    // TODO: Implement error handling (e.g., retry, logging)
  }
}

setInterval(async () => {
  processedUpdates.clear(); // Clear the set every hour
  // Trigger processing of any pending messages in Kafka
  await consumer.run({
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      try {
        const data = JSON.parse(message!.value!.toString());
        const { userAddress, metadataType, userId } = data;// Retrieve private key
        await processMetadataUpdate(userAddress, metadataType, userId); // Pass privateKey to the helper function
      } catch (error) {
        console.error('Error processing message:', error);
        // TODO: Implement error handling (e.g., send to a dead-letter queue)
      }
    },
  });
}, METADATA_UPDATE_INTERVAL); 

export default app;