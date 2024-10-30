import { Elysia } from 'elysia';
import cron, { Patterns } from '@elysiajs/cron'
import { EachMessagePayload, Kafka } from 'kafkajs';
import { KAFKA_BROKERS } from '../../config'
import { getMetadataFromS3, updateMetadataInS3 } from '../s3'
import { privateKey } from '../key'

// --- Initialize Services ---
const kafka = new Kafka({ clientId: 'my-app', brokers: KAFKA_BROKERS });
const producer = kafka.producer();
await producer.connect();

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

const kafkaCron = new Elysia()
  .use(
    cron({
      name: 'kafka-consumer',
      pattern: Patterns.everyMinutes(10),
      async run() {
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
      }
    })
  )

export {
  kafka,
  producer,
  consumer,
  kafkaCron
}

