import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";
import { IUser } from "./user";

export interface SessionData {
  accessToken: string;
  user: {
    userData: IUser;
    token: string;
  };
}

// Extend the Session interface
declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: IUser & DefaultSession["user"];
  }

  interface User extends IUser {
    token: string;
    expiresAt: number;
    expiresAtString: string;
  }
}

// Extend the JWT interface
declare module "next-auth/jwt" {
  interface JWT extends IUser, DefaultJWT {
    expiresAt: number;
    accessToken: string;
  }
}
