"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import TableData from "../common/table-data";
import { generateData } from "../../../utils/create-table/create-data-resident-table";
import { useResidentStore } from "@/lib/store/use-resident-store";
import {
  useDeleteResident,
  useResidents,
} from "@/lib/tanstack-query/residents/queries";
import { useState } from "react";
import { Resident } from "../../../types/residents";

export function ResidentTable() {
  const { filters, setFilter, clearFilters } = useResidentStore();
  const { data, isLoading, isError } = useResidents(filters);
  const deleteResidentMutation = useDeleteResident();

  const [residentToDelete, setResidentToDelete] = useState<Resident | null>(
    null
  );
  // Xử lý xóa cư dân
  const handleDeleteClick = (resident: Resident) => {
    setResidentToDelete(resident);
  };

  const confirmDelete = async () => {
    if (!residentToDelete) return;

    try {
      await deleteResidentMutation.mutateAsync(residentToDelete.id);
      toast(`Đã xóa cư dân ${residentToDelete.fullName}`);
      setResidentToDelete(null);
    } catch (error) {
      toast("Đã xảy ra lỗi khi xóa cư dân");
    }
  };

  // Tính toán phân trang
  const totalPages = Math.ceil(data?.data?.recordsTotal || 0 / filters.size);

  const columns = generateData({
    handleDeleteClick,
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
          <Button onClick={clearFilters}>Đặt lại bộ lọc</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-5">
      {/* Danh sách cư dân */}
      <TableData
        columns={columns}
        datas={data?.data?.data}
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
              value={filters.size.toString()}
              onValueChange={(value) => setFilter({ size: Number(value) })}
            >
              <SelectTrigger className="w-[100px]">
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

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFilter({ page: Math.max(filters.page, 0) })}
              disabled={filters.page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum = i + 1;

                // Nếu có nhiều trang và đang ở trang sau
                if (totalPages > 5 && filters.page > 3) {
                  pageNum = filters.page - 3 + i;

                  // Đảm bảo không vượt quá tổng số trang
                  if (pageNum > totalPages) {
                    pageNum = totalPages - (4 - i);
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
                    {pageNum}
                  </Button>
                );
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
      </div>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={!!residentToDelete}
        onOpenChange={(open) => !open && setResidentToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa cư dân</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa cư dân này? Hành động này không thể hoàn
              tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResidentToDelete(null)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
