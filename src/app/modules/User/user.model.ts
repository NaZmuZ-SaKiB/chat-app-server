import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

import { TUser } from "./user.type";
import config from "../../config";

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    image: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

userSchema.post("save", async function (doc, next) {
  doc.password = "";

  next();
});

export const User = model<TUser>("User", userSchema);
