import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ConversationService } from "./conversation.service";

const getConversationWith = catchAsync(async (req, res) => {
  const conversation = await ConversationService.getConversationWith(
    req.user.id,
    req.params.recipientId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Conversation found",
    data: conversation,
  });
});

const startConversation = catchAsync(async (req, res) => {
  const conversation = await ConversationService.startConversation(
    req.user.id,
    req.params.recipientId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Conversation started successfully",
    data: conversation,
  });
});

export const ConversationController = {
  getConversationWith,
  startConversation,
};
