"use client";

import React from "react";
import { IProperty } from "@/interface/property";
import { IUser } from "@/interface/user";
import { IMeta } from "@/interface/general";
import PropertyCard from "@/components/property/PropertyCard";
import { Stat, StatsWrapper } from "@/components/misc/Stat";
import TabbedListingView from "@/components/misc/TabbedListingView";
import CustomButton from "@/components/buttons/CustomButton";
import { useRouter } from "next/navigation";

interface Props {
  initialProperties: IProperty[];
  user: IUser;
  meta?: IMeta;
}

const UserPropertiesList = (props: Props) => {
  const { initialProperties, user, meta } = props;
  const router = useRouter();

  const handleCreateProperty = () => {
    router.push(`/admin/users/${user.id}/properties/create`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Properties for {user.fullName}</h1>
          <p className="text-gray-600">Role: {user.role}</p>
        </div>
        <CustomButton onClick={handleCreateProperty}>
          Create Property for User
        </CustomButton>
      </div>

      <StatsWrapper className="bg-primary">
        <Stat
          title="Total Properties"
          value={String(meta?.total || initialProperties.length)}
          className="basis-[45%]"
        />
        <Stat
          title="Current Page"
          value={`${meta?.currentPage || 1} of ${meta?.lastPage || 1}`}
          className="basis-[45%]"
        />
      </StatsWrapper>

      <TabbedListingView
        items={initialProperties}
        title="User Properties"
        titleStyle="solid"
        tabs={["all"]}
        tabDescription={`Properties listed by ${user.fullName}`}
        emptyStateMessage="This user has no properties yet."
        renderItem={(property: IProperty, index: number) => (
          <PropertyCard key={index} property={property} />
        )}
      />
    </div>
  );
};

export default UserPropertiesList;