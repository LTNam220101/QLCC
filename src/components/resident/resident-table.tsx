"use client";

import { Button } from "@/components/ui/button";
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
        filters={filters}
        setFilter={setFilter}
        recordsTotal={data?.data?.recordsTotal}
      />

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
