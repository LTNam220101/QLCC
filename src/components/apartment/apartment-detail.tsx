"use client";
import { useApartmentStore } from "@/lib/store/use-apartment-store";
import InfoRow from "../common/info-row";
import { buildings, getDisplayName } from "@/lib/store/use-resident-store";

interface ApartmentDetailProps {
  apartmentId: number;
}

export function ApartmentDetail({ apartmentId }: ApartmentDetailProps) {
  const { apartments } = useApartmentStore();
  const apartment = apartments.find((apt) => apt.id === apartmentId);

  if (!apartment) {
    return (
      <div className="space-y-4 mt-5 mb-[30px]">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold">Không tìm thấy căn hộ</h2>
          <p className="mt-2 text-muted-foreground">
            Căn hộ này không tồn tại hoặc đã bị xóa
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-5 mb-[30px]">
      <h2 className="font-bold">Thông tin chung</h2>
      <div className="grid md:grid-cols-2 gap-x-10">
        <div>
          <InfoRow label="Căn hộ" value={apartment.apartmentNumber} />
          <InfoRow label="Ghi chú" value={apartment.note || "-"} />
        </div>
        <div>
          <InfoRow label="Diện tích" value={apartment.area || "-"} />
          <InfoRow
            label="Tòa nhà"
            value={getDisplayName(apartment.building, buildings)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold">Thông tin khác</h2>
        <div className="grid md:grid-cols-2 gap-x-10">
          <div>
            <InfoRow label="Người tạo" value={apartment.createdBy} />
            <InfoRow label="Người cập nhật" value={apartment.updatedBy} />
          </div>
          <div>
            <InfoRow label="Ngày tạo" value={apartment.createdAt} />
            <InfoRow label="Ngày cập nhật" value={apartment.updatedAt} />
          </div>
        </div>
      </div>
    </div>
  );
}
