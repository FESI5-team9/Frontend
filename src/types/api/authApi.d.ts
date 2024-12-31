export type User = {
  id: number;
  email: string;
  nickname?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
};

export type PostUsers = Pick<User, "email" | "nickname"> & {
  password: string;
};

export type Login = Pick<User, "email"> & {
  password: string;
};

export type LoginRes = {
  accessToken: string;
};

export type PutUsers = Pick<User, "nickname"> & {
  image?: File | null;
};
