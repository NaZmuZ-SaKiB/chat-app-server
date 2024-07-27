import jwt from "jsonwebtoken";

export const createToken = (
  id: string,
  username: string,
  email: string,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(
    {
      id,
      username,
      email,
    },
    secret,
    {
      expiresIn,
    }
  );
};
