import { Kafka } from 'kafkajs';
import { KAFKA_BROKERS } from '../../config'

// --- Initialize Services ---
const kafka = new Kafka({ clientId: 'my-app', brokers: KAFKA_BROKERS });
const producer = kafka.producer();
await producer.connect();

const consumer = kafka.consumer({ groupId: 'metadata-group' });
await consumer.connect();
await consumer.subscribe({ topic: 'metadata-updates' });

export {
  kafka,
  producer,
  consumer,
}

