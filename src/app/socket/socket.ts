import { Server } from "socket.io";
import http from "http";
import config from "../config";
import app from "../../app";

type CandidateData = {
  receiverId: string;
  candidate: RTCIceCandidateInit;
  senderId: string;
};

type OfferAnswerData = {
  receiverId: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  senderId: string;
};

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

  // Handle WebRTC signaling
  socket.on("call", (data: { receiverId: string; senderId: string }) => {
    const receiverSocketId = getReceiverSocketId(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call", {
        senderId: data.senderId,
      });
    }

    console.log("Call event emitted to receiverId=", data.receiverId);
  });

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
    const receiverSocketId = getReceiverSocketId(data.senderId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("reject-call", data);
    }
  });

  socket.on("cancel-call", (data: { senderId: string; receiverId: string }) => {
    const receiverSocketId = getReceiverSocketId(data.receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("cancel-call", data);
    }
  });

  socket.on("accept-call", (data: { senderId: string; receiverId: string }) => {
    const receiverSocketId = getReceiverSocketId(data.senderId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("accept-call", data);
    }
  });

  socket.on("offer", (data: OfferAnswerData) => {
    const receiverSocketId = getReceiverSocketId(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("offer", {
        offer: data.offer,
        senderId: data.senderId,
      });
    }
  });

  socket.on("answer", (data: OfferAnswerData) => {
    const receiverSocketId = getReceiverSocketId(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("answer", {
        answer: data.answer,
        senderId: data.senderId,
      });
    }
  });

  socket.on("candidate", (data: CandidateData) => {
    const receiverSocketId = userSocketMap[data.receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("candidate", {
        candidate: data.candidate,
        senderId: data.senderId,
      });
    }
  });
});
