"use client";

import React, { useState } from "react";
import TableSearch from "../tables/TableSearch";
import CustomTable from "../tables/CustomTable";
import { IStatus, IUser } from "@/interface/user";
import { formatDate } from "@/lib/date";
import { useRouter } from "next/navigation";
import { PROFILE_ROUTE } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { Stat, StatsWrapper } from "../misc/Stat";
import CustomButton from "../buttons/CustomButton";
import RegisterUserModal from "./RegisterUserModal";
import { Eye } from "lucide-react";
import { IMeta } from "@/interface/general";
import CustomPagination from "../misc/CustomPagination";
import { useQueryString } from "@/hooks/useQueryString";

interface Props {
  initialUsers?: IUser[];
  totalUsers?: number | string;
  subscribedUsers?: number | string;
  showOnlyPaid?: boolean;
  meta?: IMeta;
}

const UsersList = (props: Props) => {
  const router = useRouter();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { setQueryParam } = useQueryString();
  const users = props.initialUsers || [];
  const totalUsers = props.totalUsers || 0;
  const subscribedUsers = props.subscribedUsers || 0;

  const handlePageChange = (page: number) => {
    setQueryParam("page", page.toString());
  };

  const subscriptionStatus = (status: IStatus) => {
    if (status === "active") {
      return "paid";
    } else {
      return "free";
    }
  };

  const subscriptionFilteredUsers = props.showOnlyPaid
    ? users.filter((user) => user.subscriptionStatus === "active")
    : users;

  return (
    <div className="space-y-6">
      {!props.showOnlyPaid && (
        <>
          <div className="flex items-center justify-between mb-8">
            <p>Users</p>
            <CustomButton
              variant="secondary"
              onClick={() => setShowRegisterModal(true)}
            >
              Add User
            </CustomButton>
          </div>
          <StatsWrapper className="bg-primary ">
            <Stat
              title="Total Users"
              value={String(totalUsers)}
              className="basis-[45%]"
            />
            <Stat
              title="Subscribed Users"
              value={String(subscribedUsers)}
              className="basis-[45%]"
            />
          </StatsWrapper>
        </>
      )}

      <TableSearch
        title={props.showOnlyPaid ? "Subscribers" : "List of Users"}
        placeholder="Search by name, email, phone..."
      />

      <CustomTable
        tableData={subscriptionFilteredUsers?.map((user) => ({
          id: user.id,
          name: user.fullName,
          phone: user.phoneNumber,
          location: user?.stateOfResidence || "-",
          dateJoined: formatDate(user.createdAt),
          role: <p className="capitalize">{user.role}</p>,
          status: (
            <p
              className={cn("capitalize w-fit px-3 py-2 rounded-[3px]", {
                ["bg-successLight text-success"]:
                  user.subscriptionStatus === "active",
                ["bg-grey100 text-grey8"]:
                  user.subscriptionStatus === "inactive",
              })}
            >
              {subscriptionStatus(user.subscriptionStatus!)}
            </p>
          ),
          actions: (
            <div className="flex gap-2">
              <CustomButton
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  if (user.role === 'affiliate') {
                    router.push(`/admin/affiliates/${user.id}/properties`);
                  } else if (user.role === 'buyer') {
                    router.push(`/admin/buyers/${user.id}/properties`);
                  } else {
                    router.push(`/admin/users/${user.id}/properties`);
                  }
                }}
                className="flex items-center gap-1"
              >
                <Eye size={14} />
                View Properties
              </CustomButton>
            </div>
          ),
        }))}
        hiddenColumns={["profileFiles", "id"]}
        isClickable
        onRowClick={(item) => {
          router.push(`${PROFILE_ROUTE}/${item.id}`);
        }}
      />
      {props.meta && props.meta.lastPage > 1 && (
        <div className="mt-6">
          <CustomPagination
            currentPage={props.meta.currentPage}
            totalPages={props.meta.lastPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      <RegisterUserModal
        isShown={showRegisterModal}
        setIsShown={setShowRegisterModal}
      />
    </div>
  );
};

export default UsersList;
