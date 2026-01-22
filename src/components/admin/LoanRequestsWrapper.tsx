import LoanRequests from "@/components/admin/LoanRequests";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { ILoanSummary } from "@/interface/loan";
import { adminGuard } from "@/lib/admin";
import { loanRequests, loanStats } from "@/services/admin.service";
import React from "react";

interface IProps {
    searchParams: {
        search?: string;
        page?: string;
        limit?: string;
        [key: string]: string | string[] | undefined;
    };
}

export default async function LoanRequestsWrapper({ searchParams }: IProps) {
    const { token } = await adminGuard();

    const [loans, loanStat] = await Promise.all([
        loanRequests(
            token,
            {
                search: searchParams.search,
                page: searchParams.page ? parseInt(searchParams.page) : 1,
                limit: searchParams.limit ? parseInt(searchParams.limit) : 50,
            },
            {
                cache: "force-cache",
                next: { revalidate: 300, tags: ["admin-loan-requests"] },
            }
        ),
        loanStats(token, {
            cache: "force-cache",
            next: { revalidate: 300, tags: ["admin-loan-stats"] },
        }),
    ]);

    if (!loans?.success || !loanStat?.success) {
        return <ErrorDisplay message="An error occured while fetching loan requests" />;
    }

    const statistics = loans.data.statistics || {
        totalLoans: 0,
        activeLoans: 0,
        completedLoans: 0,
    };

    return (
        <LoanRequests
            initialLoans={loans?.data?.data || []}
            loanStats={loanStat?.data as ILoanSummary}
            statistics={statistics}
        />
    );
}
