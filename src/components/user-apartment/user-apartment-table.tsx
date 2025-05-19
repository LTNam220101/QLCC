"use client";

import { Button } from "@/components/ui/button";
import { useUserApartmentStore } from "@/lib/store/use-user-apartment-store";
import TableData from "../common/table-data";
import { generateData } from "../../../utils/create-table/create-data-user-apartment-table";
import { useUserApartments } from "@/lib/tanstack-query/user-apartments/queries";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { UserApartment } from "../../../types/user-apartments";
import { useState } from "react";

export function UserApartmentTable() {
  const router = useRouter()
  const { filters, setFilter, clearFilters } = useUserApartmentStore();

  const { data, isLoading, isError, isRefetching } = useUserApartments(filters);


  const [userApartmentToUpdate, setUserApartmentToUpdate] = useState<{
    userApartment: UserApartment;
    newStatus: number;
  } | null>(null);

  const columns = generateData({
    startIndex: filters?.size * filters?.page || 0,
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
    <div className="space-y-4">
      {/* Danh sách căn hộ */}
      <TableData
        columns={columns}
        datas={data?.data?.data}
        isLoading={isLoading || isRefetching}
        filters={filters}
        setFilter={setFilter}
        recordsTotal={data?.data?.recordsTotal}
        onClickRow={(_, userApartment) => {
          router.push(`/building-information/links/${userApartment.userApartmentMappingId}`)
        }}
      />
      {/* <Dialog
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
      </Dialog> */}
    </div>
  );
}
