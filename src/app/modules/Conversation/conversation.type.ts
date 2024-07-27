import { Types } from "mongoose";

export type TConversation = {
  participants: Types.ObjectId[];
  conversationName?: string;
  lastMessage: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
