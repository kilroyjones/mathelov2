// Libraries and modules
import Client from "pocketbase";
import dotenv from "dotenv";
import express from "express";
import http from "http";

import { RabbitMQService } from "./service/rabbitmq.service";
import { Server } from "socket.io";
import { PocketBaseService } from "./service/pocketbase.service";

// Types
import type { QueuedQuestion, RabbitMQConnection } from "./types/rabbitmq";
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
 * @param pocketbase
 * @returns
 */
async function getQuestion(pocketbase: Client): Promise<{ type: string; msg: any } | undefined> {
  if (pocketbase) {
    try {
      const records = await pocketbase.collection("questions").getFullList({});
      if (records.length > 0) {
        const randomIndex = Math.floor(Math.random() * records.length);
        return { type: "get-question", msg: records[randomIndex] };
      }
    } catch (error: any) {
      console.log("butter", error);
    }
  }
}

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

    if (pocketbase == undefined) {
      console.error("[index:setupServer] - Pocketbase not initialized");
      return false;
    }

    const rabbitChannel = rabbitMQConnection.channel;
    RabbitMQService.processQueue(rabbitChannel);

    io.on("connection", async socket => {
      console.log("a user connected");

      const quesiton = getQuestion(pocketbase);
      socket.on("message", async (message: Message) => {
        const { type, msg } = message;

        let payload: any | undefined;

        switch (type) {
          case "get-question":
            payload = await getQuestion(pocketbase);
            if (payload && rabbitChannel) {
              socket.emit("message", payload);
              const queuedQuestion: QueuedQuestion = { userId: "1234", questionId: payload.msg.id };
              await RabbitMQService.queueMessage(rabbitChannel, payload.msg.time, queuedQuestion);
            }
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
