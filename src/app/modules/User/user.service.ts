import { Types } from "mongoose";
import { Conversation } from "../Conversation/conversation.model";
import { User } from "./user.model";
import { TUser } from "./user.type";

const getSidebarConversations = async (userId: string) => {
  // const conversation = await Conversation.find({
  //   participants: { $in: [userId] },
  // })
  //   .populate("participants")
  //   .sort("-lastMessage");

  const conversation = await Conversation.aggregate([
    {
      $match: {
        participants: { $in: [new Types.ObjectId(userId)] },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "participants",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              username: 1,
              email: 1,
              image: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "messages",
        localField: "lastMessage",
        foreignField: "_id",
        as: "lastMessage",
      },
    },
    {
      $unwind: "$lastMessage",
    },
    {
      $sort: { "lastMessage.createdAt": -1 },
    },
  ]);

  const sideBarItems = conversation.map((item) => ({
    _id: item._id,
    conversationName: item?.conversationName,
    lastMessage: item?.lastMessage,
    users: item.participants.filter(
      (user: any) => user._id.toString() !== userId
    ),
  }));

  return sideBarItems;
};

const getUserById = async (userId: string) => {
  return await User.findById(userId);
};

const getUserByConversationId = async (
  userId: string,
  conversationId: string
) => {
  const conversation = await Conversation.findById(conversationId);

  const profileId = conversation?.participants?.filter(
    (item) => item.toString() !== userId
  )[0];

  return await User.findById(profileId);
};

const searchUsers = async (userId: string, searchTerm: string) => {
  return await User.find({
    $or: [
      { name: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
      { username: { $regex: searchTerm, $options: "i" } },
    ],
    _id: { $ne: userId },
  });
};

const update = async (userId: string, data: Partial<TUser>) => {
  return await User.findByIdAndUpdate(userId, data, { new: true });
};

export const UserService = {
  getUserById,
  getUserByConversationId,
  getSidebarConversations,
  searchUsers,
  update,
};
