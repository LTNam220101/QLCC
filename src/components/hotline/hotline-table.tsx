"use client";

import { useState } from "react";
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
import { useRouter } from "next/navigation";

export function HotlineTable() {
  const router = useRouter()
  const { filter, setFilter, resetFilter } = useHotlineFilterStore();
  const { data, isLoading, isError } = useHotlines(filter);
  const deleteHotlineMutation = useDeleteHotline();
  const updateHotlineMutation = useUpdateHotline();

  const [hotlineToDelete, setHotlineToDelete] = useState<Hotline | null>(null);

  const [hotlineToUpdateStatus, setHotlineToUpdateStatus] =
    useState<Hotline | null>(null);

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
    startIndex: filter?.size * filter?.page || 0,
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
        filters={filter}
        setFilter={setFilter}
        recordsTotal={data?.data?.recordsTotal}
        onClickRow={(_, hotline)=>{
          router.push(`/services/hotlines/${hotline.hotlineId}`)
        }}
      />

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
