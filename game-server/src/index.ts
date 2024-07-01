// Libraries and modules
import dotenv from "dotenv";
import express from "express";
import http from "http";

import { RabbitMQService } from "./service/rabbitmq.service";
import { Server } from "socket.io";
import { PocketBaseService } from "./service/pocketbase.service";

// Types
import type { RabbitMQConnection } from "./types/rabbitmq";

// Load environment variables from .env file
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity; adjust as needed for your setup
    methods: ["GET", "POST"],
  },
});

/**
 *
 */
async function initializeServer(): Promise<boolean> {
  try {
    const rabbitMQConnection: RabbitMQConnection | undefined = await RabbitMQService.start();
    const pocketbase = await PocketBaseService.getInstance();

    if (rabbitMQConnection == undefined) {
      console.error("[index:setupServer] - RabbitMQ not initialized");
      return false;
    }

    const rabbitChannel = rabbitMQConnection.channel;
    RabbitMQService.processQueue(rabbitChannel);

    io.on("connection", async socket => {
      console.log("a user connected");

      //
      socket.on("message", async (msg: { id: string; delay: number }) => {
        const { id, delay } = msg;
        console.log("message?", id, delay);
        if (rabbitChannel) {
          await RabbitMQService.queueMessage(rabbitChannel, id, 2000);
        }
      });

      //
      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });

    return true;
  } catch (error) {
    console.error("[Server] - Failed to initialize", error);
    return false;
  }
}

/**
 *
 */
(async () => {
  const status = await initializeServer();
  if (status) {
    server.listen(3000, () => {
      console.info("[Server] - Listening on *:3000");
    });
  } else {
    console.error("[Server] - Failed to start");
  }
})();
