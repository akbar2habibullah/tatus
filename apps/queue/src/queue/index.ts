import { EachMessagePayload } from 'kafkajs'
import { consumer } from '../kafka'
import { getMetadataFromS3, updateMetadataInS3 } from '../s3'
import { redis } from '../redis'
import Elysia from 'elysia'
import cron, { Patterns } from '@elysiajs/cron'
import { privateKey } from '../key'

// --- Batching Logic ---
let batchedUpdates: Record<string, Record<string, number>> = {};
const BATCH_SIZE = 1000;

// Function to add an update to the batch
function addToBatch(userAddress: string, metadataType: string, increment: number = 1) {
  if (!batchedUpdates[userAddress]) {
    batchedUpdates[userAddress] = {};
  }
  batchedUpdates[userAddress][metadataType] = (batchedUpdates[userAddress][metadataType] || 0) + increment;
}

// Function to generate a unique key for tracking updates
function getUpdateKey(userId: string, address: string, metadataType: string) {
  return `${userId}-${address}-${metadataType}`;
}

// Function to process a batch of updates
async function processBatch(batch: Record<string, Record<string, number>>) {
  for (const address in batch) {
    try {
      const metadata = await getMetadataFromS3(address);
      for (const type in batch[address]) {
        metadata[type] = (metadata[type] || 0) + batch[address][type];
      }
      // TODO: Sign updated metadata 
      await updateMetadataInS3(address, metadata, privateKey);
    } catch (error) {
      console.error(`Error updating metadata for ${address}:`, error);
      // TODO: Implement error handling (e.g., retry, logging)
    }
  }
}

await consumer.run({
  eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
    try {
      const data = JSON.parse(message!.value!.toString());
      const { userAddress, metadataType, userId } = data;

      const updateKey = getUpdateKey(userId, userAddress, metadataType);
      if (await redis.sismember("processed-updates", updateKey)) {
        return;
      }

      addToBatch(userAddress, metadataType);
      await redis.sadd("processed-updates", updateKey);

      // Trigger batch processing if batch size is reached
      if (Object.keys(batchedUpdates).length >= BATCH_SIZE) {
        await processBatch(batchedUpdates);
        batchedUpdates = {}; // Clear the batch after processing
      }

    } catch (error) {
      console.error('Error processing message:', error);
    }
  },
});

const kafkaCron = new Elysia()
  .use(
    cron({
      name: 'metadata-updates',
      pattern: Patterns.EVERY_5_MINUTES,
      async run() {
        if (Object.keys(batchedUpdates).length > 0) {
          await processBatch(batchedUpdates);
          batchedUpdates = {}; // Clear the batch after processing
        }
      }
    })
  )


export {
  kafkaCron
}