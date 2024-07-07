import "dotenv/config";
import app from "./app.js";
import connect from "./config/connection.js";
import http from "http";
import { Server } from "socket.io";
import Chat from "./models/Chat.js";

connect();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.DOMAIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("chatMessage", async (message) => {
    const chat = await Chat.create({
      message: message.message,
      sender: message.sender,
      recipient: message.recipient,
    });

    io.emit("chatMessage", chat);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Server aktif");
});

const port = 2000;
const portSocket = 1000;

app.listen(port, () => {
  console.log("Server listening on port " + port);
});

server.listen(portSocket, () => {
  console.log(`Socket server on port ${portSocket}`);
});