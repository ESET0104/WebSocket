import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*" }
});

httpServer.listen(5000, () => {
  console.log("User backend running on http://localhost:5000");
});

export default io;
