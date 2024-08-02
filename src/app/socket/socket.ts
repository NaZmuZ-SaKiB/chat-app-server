import { Server } from "socket.io";
import http from "http";
import config from "../config";
import app from "../../app";

type TCallType = "audio" | "video";

const userSocketMap: Record<string, string> = {};

export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: config.front_end_url,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export const getReceiverSocketId = (receiverId: string) =>
  userSocketMap?.[receiverId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query?.userId;

  if (userId) {
    userSocketMap[userId as string] = socket.id;
  } else {
    socket.disconnect();
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  console.log("A user connected. socketId =", socket.id, "userId=", userId);

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    delete userSocketMap[userId as string];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // Handle Call
  socket.on(
    "call",
    (data: { receiverId: string; senderId: string; type: TCallType }) => {
      setTimeout(() => {
        const receiverSocketId = getReceiverSocketId(data.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("call", {
            senderId: data.senderId,
            type: data.type,
          });
        }

        console.log("Call event emitted to receiverId=", data.receiverId);
      }, 5000);
    }
  );

  socket.on(
    "call-receiving",
    (data: { senderId: string; receiverId: string }) => {
      const receiverSocketId = getReceiverSocketId(data.senderId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("call-receiving", data);
      }
    }
  );

  socket.on("reject-call", (data: { senderId: string; receiverId: string }) => {
    setTimeout(() => {
      const receiverSocketId = getReceiverSocketId(data.senderId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("reject-call", data);
        console.log("call-rejected, receiverSocketId=", receiverSocketId);
      }
    }, 5000);
  });

  socket.on("cancel-call", (data: { senderId: string; receiverId: string }) => {
    const receiverSocketId = getReceiverSocketId(data.receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("cancel-call", data);
    }
  });

  socket.on(
    "accept-call",
    (data: { senderId: string; receiverId: string; type: TCallType }) => {
      setTimeout(() => {
        const receiverSocketId = getReceiverSocketId(data.senderId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("accept-call", data);
          console.log("call answered, receiverSocketId=", receiverSocketId);
        }
      }, 3000);
    }
  );

  socket.on("end-call", (data: { to: string }) => {
    const receiverSocketId = getReceiverSocketId(data.to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("end-call");
    }
  });
});
