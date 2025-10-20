import { SIGN_IN_ROUTE } from "@/constants/routes";

let loggingOut = false;

const clearAuthCookies = () => {
  if (typeof document === "undefined") {
    return;
  }

  const expiration = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  const paths = ["/", "/dashboard", "/auth"];

  for (const path of paths) {
    document.cookie = `token=; ${expiration}; path=${path}`;
    document.cookie = `role=; ${expiration}; path=${path}`;
  }
};

export const triggerClientLogout = async () => {
  if (typeof window === "undefined" || loggingOut) {
    return;
  }

  loggingOut = true;

  try {
    const [nextAuth, googleAuth, localStoreModule] = await Promise.all([
      import("next-auth/react"),
      import("@react-oauth/google"),
      import("@/store/state/localStore"),
    ]);

    try {
      localStoreModule.useLocalStore.getState().clear();
    } catch (storeError) {
      console.error("Failed to reset local store during logout", storeError);
    }

    try {
      if (typeof googleAuth.googleLogout === "function") {
        googleAuth.googleLogout();
      }
    } catch (googleError) {
      console.error("Failed to revoke Google session during logout", googleError);
    }

    clearAuthCookies();

    try {
      if (typeof nextAuth.signOut === "function") {
        await nextAuth.signOut({ redirect: false });
      }
    } catch (signOutError) {
      console.error("Failed to sign out via NextAuth", signOutError);
    }
  } catch (error) {
    console.error("Automatic logout failed", error);
  } finally {
    window.location.href = SIGN_IN_ROUTE;
    loggingOut = false;
  }
};
