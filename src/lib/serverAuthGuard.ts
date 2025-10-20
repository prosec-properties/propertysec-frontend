import { SIGN_IN_ROUTE } from "@/constants/routes";
import { isUnauthorizedError } from "@/api/general";
import { redirect } from "next/navigation";

type SessionLike = {
  user?: Record<string, any> & {
    token?: string;
    role?: string;
    id?: string;
    expiresAt?: string;
  };
  accessToken?: string;
  expires?: string;
} & Record<string, any>;

const isSessionExpired = (expires?: string) => {
  if (!expires) return false;

  const expiryTime = new Date(expires).getTime();
  if (Number.isNaN(expiryTime)) return false;

  return expiryTime <= Date.now();
};

export const ensureAuthenticatedSession = <T extends SessionLike | null>(
  session: T
): NonNullable<T> => {
  if (!session || !session.user) {
    redirect(SIGN_IN_ROUTE);
  }

  const token = session.user?.token || (session as SessionLike).accessToken;
  if (!token) {
    redirect(SIGN_IN_ROUTE);
  }

  const expires = session.expires || session.user?.expiresAt;
  if (isSessionExpired(expires as string | undefined)) {
    redirect(SIGN_IN_ROUTE);
  }

  return session as NonNullable<T>;
};

export const withServerAuth = async <T>(callback: () => Promise<T>) => {
  try {
    return await callback();
  } catch (error) {
    if (isUnauthorizedError(error)) {
      redirect(SIGN_IN_ROUTE);
    }
    throw error;
  }
};
