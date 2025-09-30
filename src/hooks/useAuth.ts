import { AccessToken } from "../../interface/auth";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { googleLogout } from "@react-oauth/google";
import { useLocalStore } from "@/store/state/localStore";
import { $requestWithToken } from "@/api/general";
import { setCookies } from "@/lib/auth";
import { IUser } from "@/interface/user";
import { fetchUserInfo } from "@/services/auth.service";

export const useAuth = () => {
  const { push, refresh } = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const { setUser } = useLocalStore();

  const login = useCallback(
    async (data: AccessToken) => {
      try {
        setLoading(true);
        const userData = await fetchUserInfo(data.token);

        if (!userData?.success || !userData?.data) {
          throw new Error("User not found");
        }

        setUser(userData?.data as IUser);
        setCookies("token", data.token, {
          isoDate: data.expiresAt as string,
        });

        const user = userData?.data;

        const action = await signIn("credentials", {
          ...user,
          token: data.token,
          tokenExpiresAt: data.expiresAt,
          redirect: false,
        });

        if (action?.error) {
          console.log("sign in error msg:", action.error);
          throw new Error("Sign in failed");
        }

        if (action?.ok) {
          push("/");
        }
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [push, setUser]
  );

  const logout = useCallback(async () => {
    if (!session || !session.data?.accessToken) return;

    setLoading(true);
    try {
      const response = await $requestWithToken.get(
        "/auth/logout",
        session.data.accessToken
      );

      if (!response?.success) {
        throw new Error("Logout failed");
      }

      await signOut({ redirect: false });
      googleLogout();
      push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  }, [session, push]);

  return { login, logout, loading };
};
