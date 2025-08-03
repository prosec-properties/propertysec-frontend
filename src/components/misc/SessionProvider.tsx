"use client";

import { SessionData } from "../../../interface/next-auth";
import { SessionProvider } from "next-auth/react";

type Props = {
  children?: React.ReactNode;
  session: SessionData | null;
};

export const NextAuthProvider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};
