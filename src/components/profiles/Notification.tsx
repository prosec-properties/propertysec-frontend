"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserSettings, updateUserSettings } from "@/actions/notification";
import { useUser } from "@/hooks/useUser";
import type { INotificationSettings } from "@/interface/setting";
import { extractServerErrorMessage, showToaster } from "@/lib/general";

type NotificationSettingKey =
  | "emailNotificationsFeatureUpdates"
  | "emailNotificationsListingUpdates";

const fetchErrorMessage = "Unable to fetch notification settings.";
const updateErrorMessage = "Unable to update notification settings.";

const parseNotificationResponse = (
  response: any,
  fallbackMessage: string
): INotificationSettings => {
  if (!response) {
    throw new Error(fallbackMessage);
  }

  if (response.hasError || response.success === false) {
    throw new Error(response.message || fallbackMessage);
  }

  if (!response.data) {
    throw new Error(fallbackMessage);
  }

  return response.data as INotificationSettings;
};

const Notifications = () => {
  const { token } = useUser();
  const queryClient = useQueryClient();
  const [setting, setSetting] = React.useState<INotificationSettings | null>(
    null
  );

  const { data, isPending, isError, error } = useQuery<INotificationSettings>({
    queryKey: ["notifications", token],
    enabled: Boolean(token),
    queryFn: async () => {
      const res = await getUserSettings(token);
      return parseNotificationResponse(res, fetchErrorMessage);
    },
  });

  React.useEffect(() => {
    if (data) {
      setSetting(data);
    }
  }, [data]);

  const mutation = useMutation<
    INotificationSettings,
    unknown,
    { key: NotificationSettingKey; value: boolean },
    { previousSettings: INotificationSettings | null }
  >({
    mutationFn: async ({ key, value }) => {
      const res = await updateUserSettings(token, { [key]: value });
      return parseNotificationResponse(res, updateErrorMessage);
    },
    onMutate: async ({ key, value }) => {
      await queryClient.cancelQueries({
        queryKey: ["notifications", token],
      });

      const previousSettings = setting;
      setSetting((prev) => (prev ? { ...prev, [key]: value } : prev));

      return { previousSettings };
    },
    onError: (mutationError, _variables, context) => {
      if (context?.previousSettings) {
        setSetting(context.previousSettings);
      }

      showToaster(
        extractServerErrorMessage(mutationError) || updateErrorMessage,
        "destructive"
      );
    },
    onSuccess: (updatedSettings) => {
      setSetting(updatedSettings);
      queryClient.setQueryData(["notifications", token], updatedSettings);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", token],
      });
    },
  });

  const isToggleDisabled =
    !setting || mutation.isPending || isPending || !token;

  const handleCheckChange = (value: boolean, key: NotificationSettingKey) => {
    if (isToggleDisabled) {
      return;
    }

    mutation.mutate({ key, value });
  };

  if (!token) {
    return null;
  }

  return (
    <div>
      <p className="mb-6">
        You will get an email notifications for the options you toggle on
      </p>

      {isError && (
        <p className="text-sm text-destructive mb-4">
          {extractServerErrorMessage(error) || fetchErrorMessage}
        </p>
      )}

      <div className="border-b pb-3 mb-6 flex justify-between">
        <h2 className={cn("text-xl font-medium text-left")}>
          New features & updates
        </h2>
        <Switch
          checked={setting?.emailNotificationsFeatureUpdates ?? true}
          onCheckedChange={(checked) =>
            handleCheckChange(checked, "emailNotificationsFeatureUpdates")
          }
          disabled={isToggleDisabled}
        />
      </div>

      <div className="border-b pb-3 flex justify-between">
        <h2 className={cn("text-xl font-medium text-left")}>Listing updates</h2>
        <Switch
          checked={setting?.emailNotificationsListingUpdates ?? true}
          onCheckedChange={(checked) =>
            handleCheckChange(checked, "emailNotificationsListingUpdates")
          }
          disabled={isToggleDisabled}
        />
      </div>
    </div>
  );
};

export default Notifications;
