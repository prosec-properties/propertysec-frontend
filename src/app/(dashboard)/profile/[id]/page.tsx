import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { fetchUserById } from "@/services/user.service";
import React from "react";
import ProfileWrapper from "@/components/profiles/ProfileWrapper";

type IParams = Promise<{
  id: string;
}>;

async function Page({ params }: { params: IParams }) {
  const userId = (await params).id;

  const user = await fetchUserById(userId);
  if (!user?.success) {
    return (
      <ErrorDisplay message="An error occured while fetching user details" />
    );
  }
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-7xl">
      <ProfileWrapper user={user?.data} />
    </div>
  );
}

export default Page;
