// Libraries and modules
import amqp from "amqplib";
import { Channel } from "amqplib";

// Types
import type { RabbitMQConnection } from "../types/rabbitmq";

const QUEUE_NAME: string | undefined = process.env.RABBITMQ_QUEUE;
const QUEUE_URL: string | undefined = process.env.RABBITMQ_URL;

/**
 *
 * @returns
 */
async function start(): Promise<RabbitMQConnection | undefined> {
  if (QUEUE_URL && QUEUE_NAME) {
    const connection = await amqp.connect(QUEUE_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange("delayed_exchange", "x-delayed-message", {
      durable: true,
      arguments: { "x-delayed-type": "direct" },
    });
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    await channel.bindQueue(QUEUE_NAME, "delayed_exchange", QUEUE_NAME);

    return { connection, channel };
  }
}

/**
 *
 * @param channel
 * @param id
 * @param delay
 * @returns
 */
async function queueMessage(channel: Channel, id: string, delay: number): Promise<boolean> {
  const message = { id, timestamp: Date.now() + delay };
  if (QUEUE_NAME) {
    return channel.publish("delayed_exchange", QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
      headers: { "x-delay": delay },
      persistent: true,
    });
  }
  return false;
}

/**
 *
 * @param channel
 */
async function processQueue(channel: Channel) {
  if (QUEUE_NAME) {
    channel.consume(QUEUE_NAME, msg => {
      if (msg !== null) {
        const message = JSON.parse(msg.content.toString());
        console.log("Processing message:", message);
        // Do your processing here
        channel.ack(msg);
      }
    });
  }
}

/**
 *
 * @returns
 */
async function initializeRabbitMQ() {
  let errorInitializing = false;

  if (QUEUE_URL == undefined) {
    console.error("[RabbitMQ:service] - Missing RABBITMQ_URL");
    errorInitializing = true;
  }

  if (QUEUE_NAME == undefined) {
    console.error("[RabbitMQ:service] - Missing RABBITMQ_QUEUE");
    errorInitializing = true;
  }
  return errorInitializing;
}

/**
 *
 */
(async () => {
  const success = await initializeRabbitMQ();
  if (success) {
    console.info("[RabbitMQ:service] - Started");
  } else {
    console.error("[RabbitMQ:service] - Failed to start");
  }
})();

export const RabbitMQService = {
  start,
  queueMessage,
  processQueue,
};
