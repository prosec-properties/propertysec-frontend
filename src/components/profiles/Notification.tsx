import React from "react";
import TitleWithHR from "../misc/TitleWithHR";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { useQuery } from "@tanstack/react-query";
import { getUserSettings, updateUserSettings } from "@/actions/notification";

export interface Setting {
  id: string;
  emailNotificationsFeatureUpdates: boolean;
  emailNotificationsListingUpdates: boolean;
  userId: string;
  updatedAt: string;
  createdAt: string;
}

const Notifications = () => {
  const [setting, setSetting] = React.useState<Setting>();
  const [isLoading, setIsLoading] = React.useState(false);

  const { data, error, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await getUserSettings();
      return res;
    },
  });

  React.useEffect(() => {
    if (data?.data) {
      setSetting(data?.data);
    }
  }, [data]);

  const handleCheckChange = async (
    value: boolean,
    key: "emailNotificationsFeatureUpdates" | "emailNotificationsListingUpdates"
  ) => {
    try {
      setIsLoading(true);
      const payload = {
        [key]: value,
      };
      await updateUserSettings(payload);
      refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <p className="mb-6">
        You will get an email notifications for the options you toggle on
      </p>
      <div className="border-b pb-3 mb-6 flex justify-between">
        <h2 className={cn("text-xl font-medium text-left")}>
          New features & updates
        </h2>
        <Switch
          className=""
          checked={setting?.emailNotificationsFeatureUpdates}
          onCheckedChange={(checked) => {
            handleCheckChange(checked, "emailNotificationsFeatureUpdates");
          }}
          disabled={isLoading}
        />
      </div>

      <div className="border-b pb-3 flex justify-between">
        <h2 className={cn("text-xl font-medium text-left")}>Listing updates</h2>
        <Switch
          checked={setting?.emailNotificationsListingUpdates}
          onCheckedChange={(checked) => {
            handleCheckChange(checked, "emailNotificationsListingUpdates");
          }}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default Notifications;
