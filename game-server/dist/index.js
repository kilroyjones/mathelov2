"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const ioredis_1 = __importDefault(require("ioredis"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const redis = new ioredis_1.default({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
});
io.on("connection", socket => {
    console.log("a user connected");
    socket.on("message", msg => {
        console.log("message: " + msg);
        redis.publish("chat", msg);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});
server.listen(3000, () => {
    console.log("listening on *:3000");
});
