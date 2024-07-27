import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import config from "../../config";

const signUp = catchAsync(async (req, res) => {
  const result = await AuthService.signup(req.body);

  res.cookie("jwt", result.token, {
    secure: config.node_env === "production",
    httpOnly: true,
    // sameSite: 'none', // ! uncomment on production
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully",
    data: result.user,
  });
});

const signIn = catchAsync(async (req, res) => {
  const result = await AuthService.signin(req.body);

  res.cookie("jwt", result.token, {
    secure: config.node_env === "production",
    httpOnly: true,
    // sameSite: 'none', // ! uncomment on production
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Logged in successfully",
    data: result.user,
  });
});

const signOut = catchAsync(async (req, res) => {
  res.clearCookie("jwt");

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

export const AuthController = {
  signUp,
  signIn,
  signOut,
};
