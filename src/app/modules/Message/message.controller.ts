import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MessageService } from "./message.service";

const sendMessage = catchAsync(async (req, res) => {
  const message = await MessageService.sendMessage(
    req.user?.id,
    req.params.conversationId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Message sent successfully",
    data: message,
  });
});

const getMessages = catchAsync(async (req, res) => {
  const result = await MessageService.getMessages(
    req.user?.id,
    req.params.conversationId,
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Messages fetched successfully",
    data: result,
  });
});

const seenMessage = catchAsync(async (req, res) => {
  const message = await MessageService.seenMessage(req.user?.id, req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Message seen successfully",
    data: message,
  });
});

export const MessageController = {
  sendMessage,
  getMessages,
  seenMessage,
};
