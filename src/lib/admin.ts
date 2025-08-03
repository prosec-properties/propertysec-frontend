import { authConfig } from "@/authConfig";
import { SIGN_IN_ROUTE } from "@/constants/routes";
import { USER_ROLE } from "@/constants/user";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const adminGuard = async () => {
  const session = await getServerSession(authConfig);
  const user = session?.user;
  const isAdmin = user?.role === USER_ROLE.ADMIN;
  if (!session || !isAdmin) {
    redirect(SIGN_IN_ROUTE);
  }

  return {
    user,
    token: session?.accessToken,
  };
};
