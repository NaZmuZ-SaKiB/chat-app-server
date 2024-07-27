export type TGender = "male" | "female";

export type TUser = {
  email: string;
  name: string;
  username: string;
  password: string;
  gender: TGender;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};
