const isProduction = process.env.NODE_ENV === "production";

const frontendUrl = isProduction
  // ? "https://prosec-frontend.livebuystore.workers.dev"
  ? "https://propertyprosec.com"
  : process.env.NEXT_PUBLIC_FRONTEND_URL;
const apiBaseUrl = isProduction
  ? "https://propertysec-backend.onrender.com/api/v1"
  : process.env.NEXT_PUBLIC_PRO_SEC_URL;

const nextAuthUrl = isProduction
  // ? "https://prosec-frontend.livebuystore.workers.dev/auth/callback"
  ? "https://propertyprosec.com/auth/callback"
  : process.env.NEXTAUTH_URL;

const googleCallbackUrl = isProduction
  // ? "https://prosec-frontend.livebuystore.workers.dev/auth/google/callback"
  ? "https://propertyprosec.com/auth/google/callback"
  : process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL;

export { apiBaseUrl, nextAuthUrl, googleCallbackUrl, frontendUrl };
