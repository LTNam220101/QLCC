"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useHotlineFilterStore } from "@/lib/store/use-hotline-filter-store";
import {
  useHotlines,
  useDeleteHotline,
  useUpdateHotline,
} from "@/lib/tanstack-query/hotlines/queries";
import { toast } from "sonner";
import { generateData } from "../../../utils/create-table/create-data-hotline-table";
import TableData from "../common/table-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Hotline } from "../../../types/hotlines";

export function HotlineTable() {
  const { filter, setFilter, resetFilter } = useHotlineFilterStore();
  const { data, isLoading, isError } = useHotlines(filter);
  const deleteHotlineMutation = useDeleteHotline();
  const updateHotlineMutation = useUpdateHotline();

  const [hotlineToDelete, setHotlineToDelete] = useState<Hotline | null>(null);

  const [hotlineToUpdateStatus, setHotlineToUpdateStatus] =
    useState<Hotline | null>(null);

  // Xử lý phân trang
  const handlePageChange = (page: number) => {
    setFilter({ page });
  };

  // Xử lý thay đổi số lượng hiển thị
  const handleLimitChange = (value: string) => {
    setFilter({ size: Number.parseInt(value), page: 0 });
  };

  // Xử lý xóa hotline
  const handleDelete = async () => {
    if (!hotlineToDelete) return;

    try {
      await deleteHotlineMutation.mutateAsync(hotlineToDelete.hotlineId);
      toast(`Đã xóa hotline ${hotlineToDelete.name}`);
      setHotlineToDelete(null);
    } catch (error) {
      toast("Đã xảy ra lỗi khi xóa hotline");
    }
  };
  // Xử lý đổi status hotline
  const handleUpdateStatus = async () => {
    if (!hotlineToUpdateStatus) return;
    try {
      await updateHotlineMutation.mutateAsync({
        ...hotlineToUpdateStatus,
        status: hotlineToUpdateStatus?.status === 1 ? 0 : 1,
      });
      toast(
        `Đã ${
          hotlineToUpdateStatus?.status === 1 ? "khoá" : "mở khoá"
        } hotline ${hotlineToUpdateStatus.name}`
      );
      setHotlineToUpdateStatus(null);
    } catch (error) {
      toast(
        `Đã xảy ra lỗi khi ${
          hotlineToUpdateStatus?.status === 1 ? "khoá" : "mở khoá"
        } hotline`
      );
    }
  };

  const columns = generateData({
    handleDeleteClick: (hotline) => {
      setHotlineToDelete(hotline);
    },
    handleChangeStatus: (hotline) => {
      setHotlineToUpdateStatus(hotline);
    },
  });

  // Render lỗi
  if (isError) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-red-500 mb-2">Đã xảy ra lỗi khi tải dữ liệu</p>
          <Button onClick={() => window.location.reload()}>Tải lại</Button>
        </div>
      </div>
    );
  }
  // Render khi không có dữ liệu
  if (data?.data?.data.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Không có dữ liệu</p>
          <Button onClick={resetFilter}>Đặt lại bộ lọc</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TableData<Hotline>
        datas={data?.data?.data}
        columns={columns}
        isLoading={isLoading}
      />
      {/* Phân trang */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Tổng số {data?.data?.recordsTotal} bản ghi
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Select
              value={filter?.page.toString()}
              onValueChange={(value) =>
                setFilter({ page: 0, size: Number(value) })
              }
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder={`${filter?.page}/trang`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10/trang</SelectItem>
                <SelectItem value="20">20/trang</SelectItem>
                <SelectItem value="50">50/trang</SelectItem>
                <SelectItem value="100">100/trang</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum = i + 1;

                // Nếu có nhiều trang và đang ở trang sau
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 3 + i;

                  // Đảm bảo không vượt quá tổng số trang
                  if (pageNum > totalPages) {
                    pageNum = totalPages - (4 - i);
                  }
                }

                return (
                  <Button
                    key={i}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div> */}
        </div>
      </div>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={!!hotlineToDelete}
        onOpenChange={(open) => !open && setHotlineToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa hotline</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa hotline {`${hotlineToDelete?.name}`}?
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHotlineToDelete(null)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận update status */}
      <Dialog
        open={!!hotlineToUpdateStatus}
        onOpenChange={(open) => !open && setHotlineToUpdateStatus(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Xác nhận{" "}
              {hotlineToUpdateStatus?.status === 1 ? "khoá" : "mở khoá"} hotline
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn{" "}
              {hotlineToUpdateStatus?.status === 1 ? "khoá" : "mở khoá"} hotline{" "}
              {`${hotlineToUpdateStatus?.name}`}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setHotlineToUpdateStatus(null)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleUpdateStatus}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
