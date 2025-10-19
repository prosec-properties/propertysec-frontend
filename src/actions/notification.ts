import { $requestWithToken } from "@/api/general";
import { cleanServerData, formatServerError } from "@/lib/general";
import type { INotificationSettings } from "@/interface/setting";

type NotificationSettingUpdates = Partial<
  Pick<
    INotificationSettings,
    "emailNotificationsFeatureUpdates" | "emailNotificationsListingUpdates"
  >
>;

export const getUserSettings = async (token: string) => {
  try {
    if (!token) {
      throw new Error("Unauthorized");
    }

    const response = await $requestWithToken.get<INotificationSettings>(
      `/settings`,
      token
    );

    return cleanServerData(response);
  } catch (error) {
    return formatServerError(error);
  }
};

export const updateUserSettings = async (
  token: string,
  data: NotificationSettingUpdates
) => {
  try {
    if (!token) {
      throw new Error("Unauthorized");
    }

    const response = await $requestWithToken.patch<INotificationSettings>(
      `/settings`,
      token,
      data
    );
    return cleanServerData(response);
  } catch (error) {
    return formatServerError(error);
  }
};
