import { Types } from "mongoose";

export type TMessage = {
  sender: Types.ObjectId;
  receiver?: Types.ObjectId;
  conversation: Types.ObjectId;
  message: string;
  seenBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
};
