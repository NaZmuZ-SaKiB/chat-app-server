import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

const getSidebarConversations = catchAsync(async (req, res) => {
  const users = await UserService.getSidebarConversations(req.user?.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Conversations fetched successfully",
    data: users,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const user = await UserService.getUserById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});

const getUserByConversationId = catchAsync(async (req, res) => {
  const user = await UserService.getUserByConversationId(
    req.user?.id,
    req.params.conversationId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});

const searchUsers = catchAsync(async (req, res) => {
  const users = await UserService.searchUsers(
    req.user?.id,
    (req.query?.searchTerm as string) || ""
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User fetched successfully",
    data: users,
  });
});

export const UserController = {
  getSidebarConversations,
  getUserById,
  getUserByConversationId,
  searchUsers,
};
