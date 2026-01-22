import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { adminGuard } from "@/lib/admin";
import { fetchAllUsers } from "@/services/admin.service";
import React from "react";
import UsersList from "@/components/admin/UsersList";
import { IUserRole } from "@/interface/user";

interface IProps {
    searchParams: {
        search?: string;
        page?: string;
        per_page?: string;
        role?: string;
        [key: string]: string | string[] | undefined;
    };
}

export default async function UsersListWrapper({ searchParams }: IProps) {
    const { user } = await adminGuard();

    const role = typeof searchParams.role === "string" ? searchParams.role : undefined;

    const users = await fetchAllUsers(
        user?.token || "",
        {
            search: searchParams.search,
            page: searchParams.page ? parseInt(searchParams.page) : 1,
            per_page: searchParams.per_page ? parseInt(searchParams.per_page) : 50,
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
        <UsersList
            initialUsers={users?.data?.users}
            subscribedUsers={users?.data?.subscribedUsers}
            totalUsers={users?.data?.totalUsers}
            meta={users?.data?.meta}
        />
    );
}
