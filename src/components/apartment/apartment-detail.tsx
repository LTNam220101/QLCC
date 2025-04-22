"use client";
import InfoRow from "../common/info-row";
import { getDisplayName } from "@/lib/store/use-resident-store";
import { useApartment } from "@/lib/tanstack-query/apartments/queries";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useBuildings } from "@/lib/tanstack-query/buildings/queries";

interface ApartmentDetailProps {
  apartmentId: string;
}

export function ApartmentDetail({ apartmentId }: ApartmentDetailProps) {
  const { data, isLoading, isError } = useApartment(apartmentId);
  const { data: buildings } = useBuildings();

  if (isLoading) {
    return <div className="container mx-auto p-4">Đang tải...</div>;
  }

  if (isError || !data) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-red-500 mb-2">Đã xảy ra lỗi khi tải dữ liệu</p>
          <Button onClick={() => window.location.reload()}>Tải lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-5 mb-[30px]">
      <h2 className="font-bold">Thông tin chung</h2>
      <div className="grid md:grid-cols-2 gap-x-10">
        <div>
          <InfoRow label="Căn hộ" value={data?.data?.apartmentName} />
          <InfoRow label="Ghi chú" value={data?.data?.note || "-"} />
        </div>
        <div>
          <InfoRow label="Diện tích" value={data?.data?.area || "-"} />
          <InfoRow
            label="Tòa nhà"
            value={getDisplayName(
              data?.data?.buildingName,
              (buildings || [])?.map((building) => ({
                id: building.buildingId,
                name: building.buildingName,
              }))
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold">Thông tin khác</h2>
        <div className="grid md:grid-cols-2 gap-x-10">
          <div>
            <InfoRow label="Người tạo" value={data?.data?.createBy} />
            <InfoRow label="Người cập nhật" value={data?.data?.updateBy} />
          </div>
          <div>
            <InfoRow
              label="Ngày tạo"
              value={
                data?.data?.createTime &&
                format(new Date(data?.data?.createTime), "dd/MM/yyyy", {
                  locale: vi,
                })
              }
            />
            <InfoRow
              label="Ngày cập nhật"
              value={
                data?.data?.updateTime &&
                format(new Date(data?.data?.updateTime), "dd/MM/yyyy", {
                  locale: vi,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
