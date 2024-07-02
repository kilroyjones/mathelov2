// Libraries and modules
import amqp from "amqplib";
import { Channel } from "amqplib";

// Types
import type { RabbitMQConnection } from "../types/rabbitmq";

const QUEUE_NAME: string | undefined = process.env.RABBITMQ_QUEUE;
const QUEUE_URL: string | undefined = process.env.RABBITMQ_URL;

async function waitForRabbitMQ(url: string, retries = 5, delay = 5000) {
  while (retries > 0) {
    try {
      const connection = await amqp.connect(url);

      return connection;
    } catch (error) {
      retries -= 1;
      if (retries > 0) {
        console.log(`Retrying to connect to RabbitMQ. Retries left: ${retries}`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        throw error;
      }
    }
  }
}
/**
 *
 * @returns
 */
async function start(): Promise<RabbitMQConnection | undefined> {
  if (QUEUE_URL && QUEUE_NAME) {
    try {
      const connection = await waitForRabbitMQ(QUEUE_URL);
      //  const connection = await amqp.connect(QUEUE_URL);
      if (connection) {
        const channel = await connection.createChannel();

        await channel.assertExchange("delayed_exchange", "x-delayed-message", {
          durable: true,
          arguments: { "x-delayed-type": "direct" },
        });

        await channel.assertQueue(QUEUE_NAME, { durable: true });
        await channel.bindQueue(QUEUE_NAME, "delayed_exchange", QUEUE_NAME);

        return { connection, channel };
      }
    } catch (error: any) {
      console.error("[RabbitMQ:start] - Failed to start RabbitMQ:", error);
    }
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
  let success = true;

  if (QUEUE_URL == undefined) {
    console.error("[RabbitMQ:service] - Missing RABBITMQ_URL");
    success = false;
  }

  if (QUEUE_NAME == undefined) {
    console.error("[RabbitMQ:service] - Missing RABBITMQ_QUEUE");
    success = false;
  }

  console.log(QUEUE_NAME, QUEUE_URL);

  return success;
}

/**
 *
 */
(async () => {
  const success = await initializeRabbitMQ();
  console.log(success);
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
