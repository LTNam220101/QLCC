"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useReportFilterStore } from "@/lib/store/use-report-filter-store";
import {
  useReports,
  useDeleteReport,
  useUpdateReport,
} from "@/lib/tanstack-query/reports/queries";
import { toast } from "sonner";
import { generateData } from "../../../utils/create-table/create-data-report-table";
import TableData from "../common/table-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Report } from "../../../types/reports";

export function ReportTable() {
  const { filter, setFilter, resetFilter } = useReportFilterStore();
  const { data, isLoading, isError } = useReports(filter);
  const deleteReportMutation = useDeleteReport();
  const updateReportMutation = useUpdateReport();
  const [typeUpdate, setTypeUpdate] = useState<number | undefined>(undefined);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

  const [reportToUpdateStatus, setReportToUpdateStatus] =
    useState<Report | null>(null);

  // Xử lý xóa report
  const handleDelete = async () => {
    if (!reportToDelete) return;

    try {
      await deleteReportMutation.mutateAsync(reportToDelete.reportId);
      toast(`Đã xóa phản ánh`);
      setReportToDelete(null);
    } catch (error) {
      toast("Đã xảy ra lỗi khi xóa phản ánh");
    }
  };
  // Xử lý đổi status report
  const handleUpdateStatus = async (status: number) => {
    if (!reportToUpdateStatus) return;
    try {
      await updateReportMutation.mutateAsync({
        ...reportToUpdateStatus,
        status: status,
      });
      toast(`Đã đổi trạng thái phản ánh ${reportToUpdateStatus.reportId}`);
      setReportToUpdateStatus(null);
    } catch (error) {
      toast(`Đã xảy ra lỗi khi đổi trạng thái`);
    }
  };

  const columns = generateData({
    handleDeleteClick: (report) => {
      setReportToDelete(report);
    },
    handleChangeStatus: (report, status) => {
      setReportToUpdateStatus(report);
      setTypeUpdate(status);
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
      <TableData<Report>
        datas={data?.data?.data}
        columns={columns}
        isLoading={isLoading}
        filters={filter}
        setFilter={setFilter}
        recordsTotal={data?.data?.recordsTotal}
      />

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={!!reportToDelete}
        onOpenChange={(open) => !open && setReportToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa phản ánh</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa phản ánh? Hành động này không thể hoàn
              tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportToDelete(null)}>
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
        open={!!reportToUpdateStatus}
        onOpenChange={(open) => !open && setReportToUpdateStatus(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận đổi trạng thái phản ánh</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn đổi trạng thái phản ánh?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReportToUpdateStatus(null)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleUpdateStatus(typeUpdate!)}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
