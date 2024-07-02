// Libraries and modules
import dotenv from "dotenv";
import express from "express";
import http from "http";

import { RabbitMQService } from "./service/rabbitmq.service";
import { Server } from "socket.io";
import { PocketBaseService } from "./service/pocketbase.service";

// Types
import type { RabbitMQConnection } from "./types/rabbitmq";
import type { Message } from "./types/messages";

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
    const pocketbase = await PocketBaseService.getInstance();
    const rabbitMQConnection: RabbitMQConnection | undefined = await RabbitMQService.start();

    if (rabbitMQConnection == undefined) {
      console.error("[index:setupServer] - RabbitMQ not initialized");
      return false;
    }

    const rabbitChannel = rabbitMQConnection.channel;
    RabbitMQService.processQueue(rabbitChannel);

    io.on("connection", async socket => {
      console.log("a user connected");

      //
      socket.on("message", async (message: Message) => {
        const { type, msg } = message;

        if (pocketbase) {
          const records = await pocketbase.collection("users").getList();
          const len = records.totalItems;
          if (len > 0) {
          }
        }
        if (pocketbase) {
          try {
            const records = await pocketbase.collection("questions").getFullList({});
            if (records.length > 0) {
              const randomIndex = Math.floor(Math.random() * records.length);
              console.log("EMIT");
              socket.emit("message", records[randomIndex]);
            }
          } catch (error: any) {
            console.log("butter", error);
          }
        }

        if (rabbitChannel) {
          await RabbitMQService.queueMessage(rabbitChannel, "sdf", 2000);
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
