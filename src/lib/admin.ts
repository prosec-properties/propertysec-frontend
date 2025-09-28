import { authConfig } from "@/authConfig";
import { SIGN_IN_ROUTE } from "@/constants/routes";
import { USER_ROLE } from "@/constants/user";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const adminGuard = async () => {
  const session = await getServerSession(authConfig);
  const user = session?.user;
  const isAdmin = user?.role === USER_ROLE.ADMIN;
  const isImpersonating = !!(session as any)?.impersonating;
  
  if (!session || (!isAdmin && !isImpersonating)) {
    redirect(SIGN_IN_ROUTE);
  }

  return {
    user,
    token: session?.accessToken,
    impersonating: (session as any)?.impersonating,
  };
};
