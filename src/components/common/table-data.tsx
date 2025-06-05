"use client"
import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table"
import { cn } from "@/lib/utils"
import { Skeleton } from "../ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select"
import { Button } from "../ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export type textAlign =
  | "text-left"
  | "text-center"
  | "text-right"
  | "text-justify"
  | "text-start"
  | "text-end"
  | undefined

export type Column<T> = {
  className?: string
  textAlign?: textAlign
  render?: (data: T, index: number) => React.ReactNode
  dataIndex: string
  name?: React.ReactNode
}

type ListingTableDataProps<T> = {
  columns?: Column<T>[]
  datas?: T[]
  isLoading?: boolean
  recordsTotal?: number
  filters: Record<string, any>
  setFilter: (arg0: Record<string, any>) => void
  onClickRow?: (index: number, data: T) => void
}

function TableData<T>({
  columns,
  datas,
  isLoading = false,
  recordsTotal,
  filters,
  setFilter,
  onClickRow = () => { }
}: ListingTableDataProps<T>) {
  const totalPages = Math.ceil((recordsTotal || 0) / filters.size)
  return (
    <>
      <Table className="text-sm overflow-auto w-full table-auto rounded-lg">
        <TableHeader>
          <TableRow>
            {columns?.map((column, index) => (
              <TableHead
                className={cn(
                  "whitespace-nowrap last:rounded-tr-lg first:rounded-tl-lg",
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
          {isLoading
            ? Array.from({ length: 6 }).map((_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`} className="">
                {columns?.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className={cn(column?.textAlign, column.className, "h-[50px]")}
                  >
                    <Skeleton className="h-[20px] w-[60%]" />
                  </TableCell>
                ))}
              </TableRow>
            ))
            : datas?.map((data, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => {
                  onClickRow(rowIndex, data)
                }}
                className=" cursor-pointer"
              >
                {columns?.map((column, colIndex) => {
                  return (
                    <TableCell
                      key={`${rowIndex}${column.dataIndex}${colIndex}`}
                      className={cn(
                        column?.textAlign,
                        column.className,
                        "h-[50px] group-hover:bg-[#F4F4F4]"
                      )}
                    >
                      {column.render
                        ? column.render(data, rowIndex)
                        : data?.[column.dataIndex] ?? "---"}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {/* Phân trang */}
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-2">
          <div className="text-sm text-[#79828B] font-semibold">
            Tổng số {recordsTotal} bản ghi
          </div>
          <div className="flex items-center">
            <Select
              value={filters?.size?.toString()}
              onValueChange={(value) => setFilter({ size: Number(value) })}
            >
              <SelectTrigger className="w-[100px] p-2" size="sm">
                <SelectValue placeholder={`${filters.size}/trang`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10/trang</SelectItem>
                <SelectItem value="20">20/trang</SelectItem>
                <SelectItem value="50">50/trang</SelectItem>
                <SelectItem value="100">100/trang</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setFilter({ page: Math.max(filters.page - 1, 0) })}
            disabled={filters.page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum = i

              // Nếu có nhiều trang và đang ở trang sau
              if (totalPages > 5 && filters.page > 3) {
                pageNum = filters.page - 3 + i

                // Đảm bảo không vượt quá tổng số trang
                if (pageNum > totalPages) {
                  pageNum = totalPages - (4 - i)
                }
              }

              return (
                <Button
                  key={i}
                  variant={filters.page === pageNum ? "default" : "outline"}
                  size="icon"
                  onClick={() => setFilter({ page: pageNum })}
                  className="w-8 h-8"
                >
                  {pageNum + 1}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setFilter({ page: Math.min(filters.page + 1, totalPages) })
            }
            disabled={filters.page === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}

export default TableData
