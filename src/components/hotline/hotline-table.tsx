"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Edit, Lock, MoreVertical, Trash, Unlock } from "lucide-react"
import { useHotlineFilterStore } from "@/lib/store/use-hotline-filter-store"
import { useHotlines, useDeleteHotline, useUpdateHotlineStatus } from "@/lib/tanstack-query/hotlines/queries"
import type { Hotline } from "@/types/hotline"
import { toast } from "sonner";

export function HotlineTable() {
  const router = useRouter()
  const { filter, setFilter } = useHotlineFilterStore()
  const { data, isLoading, isError } = useHotlines(filter)
  const deleteHotlineMutation = useDeleteHotline()
  const updateStatusMutation = useUpdateHotlineStatus()

  const [hotlineToDelete, setHotlineToDelete] = useState<Hotline | null>(null)

  // Xử lý phân trang
  const handlePageChange = (page: number) => {
    setFilter({ page })
  }

  // Xử lý thay đổi số lượng hiển thị
  const handleLimitChange = (value: string) => {
    setFilter({ limit: Number.parseInt(value), page: 1 })
  }

  // Xử lý xóa hotline
  const handleDelete = async () => {
    if (!hotlineToDelete) return

    try {
      await deleteHotlineMutation.mutateAsync(hotlineToDelete.id)
      toast(`Đã xóa hotline ${hotlineToDelete.name}`)
      setHotlineToDelete(null)
    } catch (error) {
      toast("Đã xảy ra lỗi khi xóa hotline")
    }
  }

  // Xử lý thay đổi trạng thái
  const handleStatusChange = async (hotline: Hotline) => {
    const newStatus = hotline.status === "active" ? "inactive" : "active"

    try {
      await updateStatusMutation.mutateAsync({ id: hotline.id, status: newStatus })
      toast(`Đã ${newStatus === "active" ? "kích hoạt" : "khóa"} hotline ${hotline.name}`)
    } catch (error) {
      toast("Đã xảy ra lỗi khi cập nhật trạng thái")
    }
  }

  // Render skeleton khi đang tải
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">STT</TableHead>
              <TableHead>Tên hiển thị</TableHead>
              <TableHead>Số hotline</TableHead>
              <TableHead>Tòa nhà</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-[100px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-end space-x-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-64" />
        </div>
      </div>
    )
  }

  // Render lỗi
  if (isError) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-red-500 mb-2">Đã xảy ra lỗi khi tải dữ liệu</p>
          <Button onClick={() => window.location.reload()}>Tải lại</Button>
        </div>
      </div>
    )
  }

  // Render khi không có dữ liệu
  if (data?.data.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Không có dữ liệu</p>
          <Button onClick={() => setFilter({ page: 1 })}>Đặt lại bộ lọc</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">STT</TableHead>
            <TableHead>Tên hiển thị</TableHead>
            <TableHead>Số hotline</TableHead>
            <TableHead>Tòa nhà</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-[100px]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data.map((hotline, index) => (
            <TableRow key={hotline.id}>
              <TableCell>{(filter.page - 1) * filter.limit + index + 1}</TableCell>
              <TableCell>{hotline.name}</TableCell>
              <TableCell>{hotline.phoneNumber}</TableCell>
              <TableCell>{hotline.buildingName}</TableCell>
              <TableCell>{format(new Date(hotline.createdAt), "dd/MM/yyyy", { locale: vi })}</TableCell>
              <TableCell>
                <Badge variant={hotline.status === "active" ? "default" : "destructive"} className="capitalize">
                  {hotline.status === "active" ? "Đang hoạt động" : "Đã khóa"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Mở menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/hotlines/${hotline.id}`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Chi tiết</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/hotlines/${hotline.id}/edit`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Sửa</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(hotline)}>
                      {hotline.status === "active" ? (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          <span>Khóa</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="mr-2 h-4 w-4" />
                          <span>Kích hoạt</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setHotlineToDelete(hotline)} className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Xóa</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Hiển thị</span>
          <Select value={filter.limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={filter.limit.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">trên tổng số {data?.total || 0} bản ghi</span>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, filter.page - 1))}
                disabled={filter.page <= 1}
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, data?.totalPages || 1) }, (_, i) => {
              const pageNumber = i + 1
              const isCurrentPage = pageNumber === filter.page

              return (
                <PaginationItem key={i}>
                  <PaginationLink onClick={() => handlePageChange(pageNumber)} isActive={isCurrentPage}>
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            {data?.totalPages && data.totalPages > 5 && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(data.totalPages)}
                    isActive={data.totalPages === filter.page}
                  >
                    {data.totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(data?.totalPages || 1, filter.page + 1))}
                disabled={filter.page >= (data?.totalPages || 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={!!hotlineToDelete} onOpenChange={(open) => !open && setHotlineToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa hotline "{hotlineToDelete?.name}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
