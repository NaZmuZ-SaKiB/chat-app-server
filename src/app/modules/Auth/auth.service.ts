import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "../User/user.type";
import { User } from "../User/user.model";
import config from "../../config";
import { createToken } from "../../utils/token";

const signup = async (payload: TUser & { confirmPassword: string }) => {
  if (payload.password !== payload.confirmPassword) {
    throw new AppError(httpStatus.FORBIDDEN, "Passwords do not match");
  }

  const isUserExists = await User.findOne({
    $or: [{ email: payload.email }, { username: payload.username }],
  });

  if (!!isUserExists) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Username or email already exists"
    );
  }

  if (payload.gender === "male") {
    payload.image = `${config.avatar_url}/boy?username=${payload.username}`;
  } else {
    payload.image = `${config.avatar_url}/girl?username=${payload.username}`;
  }

  const { confirmPassword, ...userData } = payload;

  const user = await User.create(userData);

  const token = await createToken(
    user._id.toString(),
    user.username,
    user.email,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return { token, user };
};

const signin = async (payload: { email: string; password: string }) => {
  const user = await User.findOne({ email: payload.email }).select("+password");

  if (!user || !(await bcrypt.compare(payload.password, user.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const { password, ...userData } = user.toObject();

  const token = await createToken(
    user._id.toString(),
    user.username,
    user.email,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return { token, user: userData };
};

type TChangePassPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const changePassword = async (userId: string, payload: TChangePassPayload) => {
  if (payload.newPassword !== payload.confirmPassword) {
    throw new AppError(httpStatus.FORBIDDEN, "Passwords do not match");
  }

  const user = await User.findById(userId).select("+password");

  if (
    !user ||
    !(await bcrypt.compare(payload.currentPassword, user.password))
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findByIdAndUpdate(userId, {
    password: hashedPassword,
  });

  return null;
};

export const AuthService = {
  signup,
  signin,
  changePassword,
};
