import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const getMe = catchAsync(async (req, res) => {
  const result = await AuthService.getMe(req?.user?.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User details",
    data: result,
  });
});

const signUp = catchAsync(async (req, res) => {
  const result = await AuthService.signup(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const signIn = catchAsync(async (req, res) => {
  const result = await AuthService.signin(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Logged in successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await AuthService.changePassword(req?.user?.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

export const AuthController = {
  getMe,
  signUp,
  signIn,
  changePassword,
};
