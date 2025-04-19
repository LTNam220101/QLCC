"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export type textAlign =
  | "text-left"
  | "text-center"
  | "text-right"
  | "text-justify"
  | "text-start"
  | "text-end"
  | undefined;

export type Column<T> = {
  className?: string;
  textAlign?: textAlign;
  render?: (data: T, index: number) => any;
  dataIndex: string;
  name?: React.ReactNode;
};

type ListingTableDataProps<T> = {
  columns?: Column<T>[];
  datas?: T[];
  isLoading?: boolean;
};

function TableData<T>({
  columns,
  datas,
  isLoading = false,
}: ListingTableDataProps<T>) {
  return (
    <Table className="text-sm overflow-auto w-full table-auto border">
      <TableHeader>
        <TableRow className="bg-[#FAFAFA] hover:bg-[#FAFAFA]">
          {columns?.map((column, index) => (
            <TableHead
              className={cn(
                "whitespace-nowrap last:rounded-tr-[4px] first:rounded-tl-[4px]",
                column?.textAlign,
                column?.className
              )}
              key={`${column?.dataIndex}_${index}`}
            >
              {column.name}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="whitespace-nowrap">
        {isLoading && (!datas || datas.length === 0)
          ? Array.from({ length: 6 }).map((_, rowIndex) => (
              <TableRow
                key={`skeleton-${rowIndex}`}
                className="border-b"
              >
                {columns?.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className={cn(column?.textAlign, column.className, "h-1")}
                  >
                    <Skeleton className="my-[10px] h-[20px] w-[60%]" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : datas?.map((data, rowIndex) => (
              <TableRow key={rowIndex} className="border-b">
                {columns?.map((column, colIndex) => {
                  return (
                    <TableCell
                      key={`${rowIndex}${column.dataIndex}${colIndex}`}
                      className={cn(
                        column?.textAlign,
                        column.className,
                        "h-1 group-hover:bg-[#F4F4F4]"
                      )}
                    >
                      {column.render
                        ? column.render(data, rowIndex)
                        : data[column.dataIndex] ?? "-"}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}

export default React.memo(TableData);
