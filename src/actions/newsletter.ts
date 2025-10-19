import { $requestWithToken, $requestWithoutToken } from "@/api/general";
import { cleanServerData, formatServerError } from "@/lib/general";

export const subscribeToNewsletter = async ({
  email,
  token,
}: {
  email: string;
  token?: string;
}) => {
  try {
    const payload = { email };
    const response = token
      ? await $requestWithToken.post("/newsletter/subscribe", token, payload)
      : await $requestWithoutToken.post("/newsletter/subscribe", payload);

    return cleanServerData(response);
  } catch (error) {
    return formatServerError(error);
  }
};
