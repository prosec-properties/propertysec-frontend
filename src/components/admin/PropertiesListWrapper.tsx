import AdminProperties from "@/components/admin/Properties";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { adminGuard } from "@/lib/admin";
import { fetchAllPropertiesAdmin } from "@/services/admin.service";
import React from "react";

interface IProps {
    searchParams: {
        status?: string;
        page?: string;
        limit?: string;
        [key: string]: string | string[] | undefined;
    };
}

export default async function PropertiesListWrapper({ searchParams }: IProps) {
    const { token } = await adminGuard();

    const status = searchParams.status || "all";

    const properties = await fetchAllPropertiesAdmin(
        token,
        {
            status,
            page: searchParams.page ? parseInt(searchParams.page) : 1,
            limit: searchParams.limit ? parseInt(searchParams.limit) : 20,
        },
        {
            cache: "force-cache",
            next: { revalidate: 300, tags: ["admin-properties"] },
        }
    );

    if (!properties?.success) {
        return <ErrorDisplay message="Failed to fetch listings" />;
    }

    return (
        <AdminProperties
            properties={properties?.data?.data}
            meta={properties?.data?.meta}
        />
    );
}
