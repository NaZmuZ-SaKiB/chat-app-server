import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Conversation } from "../Conversation/conversation.model";
import { startSession, Types } from "mongoose";
import { Message } from "./message.model";
import { getReceiverSocketId, io } from "../../socket/socket";

const sendMessage = async (
  userId: string,
  conversationId: string,
  payload: { message: string }
) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new AppError(httpStatus.NOT_FOUND, "Conversation not found");
  }

  if (conversation.participants.indexOf(new Types.ObjectId(userId)) === -1) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not a participant of this conversation"
    );
  }

  const session = await startSession();

  const receiverId = conversation.participants.filter(
    (participant) => participant.toString() !== userId
  )[0];
  try {
    session.startTransaction();

    const message = await Message.create(
      [
        {
          sender: userId,
          receiver: receiverId,
          conversation: conversationId,
          message: payload.message,
          seenBy: [userId],
        },
      ],
      { session }
    );

    await Conversation.findByIdAndUpdate(
      conversationId,
      {
        lastMessage: message[0]._id,
      },
      { session }
    );

    await session.commitTransaction();
    await session.endSession();

    const receiverSocketId = getReceiverSocketId(receiverId.toString());

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message[0]);
    }

    return message[0];
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error?.message || "Internal Server Error."
    );
  }
};

const getMessages = async (
  userId: string,
  conversationId: string,
  query: any
) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new AppError(httpStatus.NOT_FOUND, "Conversation not found");
  }

  if (conversation.participants.indexOf(new Types.ObjectId(userId)) === -1) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not a participant of this conversation"
    );
  }

  const page = parseInt(query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const messages = await Message.find({ conversation: conversationId })
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  const totalMessages = await Message.countDocuments({
    conversation: conversationId,
  });

  const isNext = totalMessages > page * limit;

  return { messages, isNext, page };
};

const seenMessage = async (userId: string, messageId: string) => {
  const message = await Message.findByIdAndUpdate(
    messageId,
    {
      $addToSet: { seenBy: userId },
    },
    { new: true, runValidators: true }
  );

  return message;
};

export const MessageService = {
  sendMessage,
  getMessages,
  seenMessage,
};
