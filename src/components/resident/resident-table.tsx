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
  useUpdateResident,
  useResidents,
  useDeleteResident,
} from "@/lib/tanstack-query/residents/queries";
import { useState } from "react";
import { Resident } from "../../../types/residents";
import { useRouter } from "next/navigation";

export function ResidentTable() {
  const router = useRouter()
  const { filters, setFilter, clearFilters } = useResidentStore();
  const { data, isLoading, isError, isRefetching } = useResidents(filters);
  const updateResidentMutation = useUpdateResident();
  const deleteResidentMutation = useDeleteResident();

  const [residentToUpdate, setResidentToUpdate] = useState<{
    resident: Resident;
    newStatus: number;
  } | null>(null);

  const [residentToDelete, setResidentToDelete] = useState<Resident | null>(
    null
  );
  // Xử lý xóa cư dân
  const handleDeleteClick = (resident: Resident) => {
    setResidentToDelete(resident);
  };

  const handleUpdateClick = (resident: Resident, status: number) => {
    setResidentToUpdate({ resident, newStatus: status });
  };

  const confirmDelete = async () => {
    if (!residentToDelete) return;

    try {
      await deleteResidentMutation.mutateAsync(residentToDelete?.id);
      toast(`Đã xoá cư dân ${residentToDelete?.fullName}`);
      setResidentToDelete(null);
    } catch (error) {
      toast("Đã xảy ra lỗi khi xoá cư dân");
    }
  };

  const confirmUpdate = async () => {
    if (!residentToUpdate) return;

    try {
      const { updateBy, updateTime, createBy, createTime, ...rest } =
        residentToUpdate?.resident;
      await updateResidentMutation.mutateAsync({
        id: residentToUpdate?.resident?.id,
        data: {
          ...rest,
          status: residentToUpdate?.newStatus,
        },
      });
      toast(`Đã cập nhật cư dân ${residentToUpdate?.resident?.fullName}`);
      setResidentToUpdate(null);
    } catch (error) {
      toast("Đã xảy ra lỗi khi cập nhật cư dân");
    }
  };

  const columns = generateData({
    startIndex: filters?.size * filters?.page || 0,
    handleDeleteClick,
    handleUpdateClick,
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
    <div className="mt-[22px] bg-white rounded-lg px-8 flex-1">
      <div className="text-lg font-semibold text-[#303438] my-[16.5px]">Danh sách</div>
      {/* Danh sách cư dân */}
      <TableData<Resident>
        columns={columns}
        datas={data?.data?.data}
        isLoading={isLoading || isRefetching}
        filters={filters}
        setFilter={setFilter}
        recordsTotal={data?.data?.recordsTotal}
        onClickRow={(_, resident) => {
          router.push(`/building-information/residents/${resident.id}`)
        }}
      />

      {/* Dialog xác nhận cập nhật */}
      <Dialog
        open={!!residentToUpdate}
        onOpenChange={(open) => !open && setResidentToUpdate(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận thay đổi trạng thái cư dân</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn thay đổi trạng thái cư dân này?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResidentToUpdate(null)}>
              Hủy
            </Button>
            <Button onClick={confirmUpdate}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Dialog xác nhận xóa */}
      <Dialog
        open={!!residentToDelete}
        onOpenChange={(open) => !open && setResidentToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xoá cư dân</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xoá cư dân này?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResidentToDelete(null)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
