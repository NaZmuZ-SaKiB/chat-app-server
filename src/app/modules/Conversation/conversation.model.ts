import { Schema, model } from "mongoose";
import { TConversation } from "./conversation.type";

const conversationSchema = new Schema<TConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    conversationName: {
      type: String,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

export const Conversation = model<TConversation>(
  "Conversation",
  conversationSchema
);
