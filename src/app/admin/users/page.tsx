import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { adminGuard } from "@/lib/admin";
import { fetchAllUsers } from "@/services/admin.service";
import React from "react";
import UsersList from "@/components/admin/UsersList";
import { IUserRole } from "@/interface/user";

type ISearchParams = Promise<{
  search?: string;
  page?: string;
  per_page?: string;
  role?: string;
  [key: string]: string | string[] | undefined;
}>;

const Page = async ({ searchParams }: { searchParams: ISearchParams }) => {
  const queries = await searchParams;
  const { user } = await adminGuard();

  const role = typeof queries.role === "string" ? queries.role : undefined;

  const users = await fetchAllUsers(
    user?.token || "",
    {
      search: queries.search,
      page: queries.page ? parseInt(queries.page) : 1,
      per_page: queries.per_page ? parseInt(queries.per_page) : 50,
      role: role as IUserRole,
    },
    {
      cache: "force-cache",
      next: { revalidate: 300, tags: ["admin-users"] },
    }
  );
  
  if (!users?.success) {
    return <ErrorDisplay message="An error occured while fetching users" />;
  }
  
  return (
    <>
      <UsersList
        initialUsers={users?.data?.users}
        subscribedUsers={users?.data?.subscribedUsers}
        totalUsers={users?.data?.totalUsers}
        meta={users?.data?.meta}
      />
    </>
  );
};

export default Page;
