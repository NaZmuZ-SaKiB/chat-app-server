import { startSession } from "mongoose";
import { Conversation } from "./conversation.model";
import { Message } from "../Message/message.model";

const getConversationWith = async (userId: string, recipientId: string) => {
  const conversation = await Conversation.findOne({
    participants: { $all: [userId, recipientId] },
  });

  return conversation;
};

const startConversation = async (
  userId: string,
  recipientId: string,
  payload: { message: string }
) => {
  const session = await startSession();

  try {
    session.startTransaction();

    const conversation = await Conversation.create(
      [
        {
          participants: [userId, recipientId],
        },
      ],
      { session }
    );

    const message = await Message.create(
      [
        {
          sender: userId,
          receiver: recipientId,
          conversation: conversation[0]._id,
          message: payload.message,
          seenBy: [userId],
        },
      ],
      { session }
    );

    conversation[0].lastMessage = message[0]._id;
    await conversation[0].save({ session });

    await session.commitTransaction();
    await session.endSession();

    return conversation[0];
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new Error(error?.message);
  }
};

export const ConversationService = {
  startConversation,
  getConversationWith,
};
