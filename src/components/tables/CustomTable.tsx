"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import EmptyTable from "./EmptyTable";
import { cn } from "@/lib/utils";

interface Props {
  tableData: Array<{ [key: string]: any }>;
  hiddenColumns?: string[];
  usePaginate?: boolean;
  isClickable?: boolean;
  onRowClick?: (row: any) => void;
  emptyTableTitle?: string;
  emptyTableDescription?: string;
  hideHeaders?: boolean;
  rowGaps?: boolean;
  compact?: boolean;
  striped?: boolean;
  key?: string;
}

const CustomTable = (props: Props) => {
  const {
    tableData,
    hiddenColumns = [],
    isClickable = false,
    onRowClick,
    emptyTableTitle,
    emptyTableDescription,
    hideHeaders = false,
    rowGaps = true,
    compact = false,
    striped = false,
  } = props;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  // const [keys, setKeys] = useState<string[]>([]);

  const handlePageChange = (toPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", toPage + "");
    replace(`${pathname}?${params.toString()}`);
  };

  // useEffect(() => {
  //   const array = tableData?.length ? Object.keys(tableData[0]) : [];
  //   const visibleKeys = array.filter(
  //     (key) => ![...hiddenColumns, "rowData"]?.includes(key)
  //   );
  //   setKeys(visibleKeys);
  // }, [hiddenColumns, tableData]);

    const keys = useMemo(() => {
      const array = tableData?.length ? Object.keys(tableData[0]) : [];
      return array.filter((key) => ![...hiddenColumns, "rowData"]?.includes(key));
    }, [hiddenColumns, tableData]);

  const handleRowClick = (row: any) => {
    if (!isClickable) return;
    onRowClick?.(row);
  };

  return (
    <>
      {tableData && tableData.length > 0 ? (
        <Table
          className={cn(
            "border-collapse text-grey10 rounded-[0.125rem] border",
            {
              "text-sm": compact,
            }
          )}
        >
          {!hideHeaders && (
            <TableHeader
              className={cn("bg-grey2", {
                "sticky top-0": rowGaps,
              })}
            >
              <TableRow>
                {keys?.map((key, index) => (
                  <TableHead
                    key={`TableHead-${index}`}
                    className={cn("font-semibold capitalize text-grey10", {
                      "py-2": !compact,
                      "py-1": compact,
                    })}
                  >
                    {key}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          )}

          <TableBody className="bg-white">
            {tableData?.map((row, mainIndex) => (
              <TableRow
                key={`TableRow-${mainIndex}`}
                className={cn(
                  {
                    "cursor-pointer": isClickable,
                    "border-b border-grey1": !rowGaps,
                    "border-[0.6px] border-solid border-grey1": rowGaps,
                    "hover:bg-grey0": isClickable,
                    "bg-grey0": striped && mainIndex % 2 === 0,
                  },
                  "text-grey9"
                )}
                onClick={() => {
                  handleRowClick(row);
                }}
              >
                {keys?.map((key, index) => (
                  <TableCell
                    key={`TableCell-${index}`}
                    className={cn({
                      "py-2": !compact,
                      "py-1": compact,
                    })}
                  >
                    {row[key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyTable
          title={emptyTableTitle}
          description={emptyTableDescription}
        />
      )}
    </>
  );
};

export default CustomTable;
