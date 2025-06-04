"use client";

import { Button } from "@/components/ui/button";
import { useApartmentStore } from "@/lib/store/use-apartment-store";
import TableData from "../common/table-data";
import { generateData } from "../../../utils/create-table/create-data-apartment-table";
import { useApartments } from "@/lib/tanstack-query/apartments/queries";
import { useRouter } from "next/navigation";

export function ApartmentTable() {
  const router = useRouter()
  const { filters, setFilter, clearFilters } = useApartmentStore();

  const { data, isLoading, isError, isRefetching } = useApartments(filters);

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
    <div className="mt-[22px] bg-white rounded-lg px-8 flex-1">
      <div className="text-lg font-semibold text-[#303438] my-[16.5px]">Danh sách</div>
      {/* Danh sách căn hộ */}
      <TableData
        columns={columns}
        datas={data?.data?.data}
        isLoading={isLoading || isRefetching}
        filters={filters}
        setFilter={setFilter}
        recordsTotal={data?.data?.recordsTotal}
        onClickRow={(_, apartment)=>{
          router.push(`/building-information/apartments/${apartment.id}`)
        }}
      />
    </div>
  );
}
