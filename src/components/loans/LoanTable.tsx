import React, { useMemo } from "react";
import TableWithRowGaps from "../tables/CustomTable";
import { Badge } from "../ui/badge";
import { ILoan } from "@/interface/loan";
import { formatDate } from "@/lib/date";
import { formatPrice } from "@/lib/payment";
import { useRouter } from "next/navigation";

interface ILoanTableData {
  name: string;
  date: string;
  amount: string;
  duration: string;
  userType: string;
  status: string;
}

interface Props {
  loans: ILoan[];
  onRowClick?: (row: any) => void;
  activeFilter?: string;
}

const badgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "pending";
    case "approved":
      return "success";
    case "rejected":
      return "destructive";
    case "disbursed":
      return "success";
    default:
      return "secondary";
  }
};

const LoanTable = ({ loans, onRowClick, activeFilter = "all" }: Props) => {
  const router = useRouter();
  
  const tableData = useMemo(() => {
    return loans.map((loan) => ({
      id: loan.id,
      name: loan.user?.fullName || "N/A",
      date: formatDate(loan.createdAt),
      amount: formatPrice(Number(loan.loanAmount)),
      duration: loan.loanDuration,
      userType: loan.user?.role ? loan.user.role.charAt(0).toUpperCase() + loan.user.role.slice(1) : "User",
      status: <Badge variant={badgeVariant(loan.loanStatus)}>{loan.loanStatus.charAt(0).toUpperCase() + loan.loanStatus.slice(1)}</Badge>,
    }));
  }, [loans]);

  const handleRowClick = (row: any) => {
    if (onRowClick) {
      onRowClick(row);
    } else {
      router.push(`/loans/${row.id}`);
    }
  };

  const getEmptyMessage = () => {
    switch (activeFilter) {
      case "all":
        return {
          title: "No loans found",
          description: "You haven't applied for any loans yet."
        };
      case "pending":
        return {
          title: "No pending loans",
          description: "You don't have any pending loan requests."
        };
      case "approved":
        return {
          title: "No approved loans",
          description: "You don't have any approved loans waiting for disbursement."
        };
      case "disbursed":
        return {
          title: "No disbursed loans",
          description: "You don't have any disbursed loans."
        };
      case "overdue":
        return {
          title: "No overdue loans",
          description: "You don't have any overdue loans."
        };
      case "rejected":
        return {
          title: "No rejected loans",
          description: "You don't have any rejected loan applications."
        };
      default:
        return {
          title: "No loans found",
          description: "You haven't applied for any loans yet."
        };
    }
  };

  if (loans.length === 0) {
    const { title, description } = getEmptyMessage();
    return (
      <div className="bg-white rounded-lg border p-8 text-center">
        <div className="text-gray-500">
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="hidden md:block">
        {" "}
        {/* Hidden on Mobile */}
        <TableWithRowGaps 
          tableData={tableData} 
          hiddenColumns={["id"]}
          isClickable={true}
          onRowClick={handleRowClick}
        />
      </div>

      <div className="md:hidden">
        {/* Hidden on Desktop */}
        {loans.map((loan, i) => (
          <div 
            key={loan.id || i} 
            className="mb-6 cursor-pointer"
            onClick={() => handleRowClick({ id: loan.id })}
          >
            <LoanTableMobile
              status={loan.loanStatus}
              name={loan.user?.fullName || "N/A"}
              amount={formatPrice(Number(loan.loanAmount))}
              date={formatDate(loan.createdAt)}
              duration={loan.loanDuration}
              userType={loan.user?.role ? loan.user.role.charAt(0).toUpperCase() + loan.user.role.slice(1) : "User"}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanTable;

const LoanTableMobile = (props: ILoanTableData) => {
  return (
    <div className="bg-white border-[0.6px] border-grey100 rounded-[0.3125rem] p-3 hover:shadow-sm transition-shadow">
      <article className="flex justify-between gap-6 items-center mb-6">
        <p>Loan</p>
        <Badge
          variant={badgeVariant(props.status)}
          className="self-end capitalize"
        >
          {props.status}
        </Badge>
      </article>
      <article className="flex justify-between gap-6 items-center text-xs font-semibold mb-3">
        <p className="text-grey8">Date</p>
        <p className="text-grey600 text-right">{props.date}</p>
      </article>

      <article className="flex justify-between gap-6 items-center text-xs font-semibold mb-3">
        <p className="text-grey8">Duration</p>
        <p className="text-grey600 text-right">{props.duration}</p>
      </article>

      <article className="flex justify-between gap-6 items-center text-xs font-semibold mb-3">
        <p className="text-grey8">Amount</p>
        <p className="text-grey600 text-right">{props.amount}</p>
      </article>
    </div>
  );
};
