"use client";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useApartmentStore,
  vehicleTypes,
} from "@/lib/store/use-apartment-store";
import { buildings, getDisplayName } from "@/lib/store/use-resident-store";

interface ApartmentDetailProps {
  apartmentId: number;
}

export function ApartmentDetail({ apartmentId }: ApartmentDetailProps) {
  const { apartments, openDrawer } = useApartmentStore();
  const apartment = apartments.find((apt) => apt.id === apartmentId);

  if (!apartment) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" asChild className="p-0 h-auto">
            <Link href="/apartments">
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>Quay lại</span>
            </Link>
          </Button>
        </div>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold">Không tìm thấy căn hộ</h2>
          <p className="mt-2 text-muted-foreground">
            Căn hộ này không tồn tại hoặc đã bị xóa
          </p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    openDrawer("edit", apartment);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild className="p-0 h-auto">
            <Link href="/apartments">
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>Quay lại</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold ml-4">Chi tiết căn hộ</h1>
        </div>
        <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
          <Edit className="h-4 w-4 mr-2" />
          Sửa
        </Button>
      </div>

      {/* Thông tin chung */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Thông tin chung</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border rounded-md">
          <div className="grid grid-cols-2 border-b md:border-r">
            <div className="p-4 bg-gray-50 font-medium border-r">Số căn hộ</div>
            <div className="p-4">{apartment.apartmentNumber}</div>
          </div>
          <div className="grid grid-cols-2 border-b">
            <div className="p-4 bg-gray-50 font-medium border-r">Tòa nhà</div>
            <div className="p-4">
              {getDisplayName(apartment.building, buildings)}
            </div>
          </div>

          <div className="grid grid-cols-2 border-b md:border-r">
            <div className="p-4 bg-gray-50 font-medium border-r">Diện tích</div>
            <div className="p-4">{apartment.area} m²</div>
          </div>
          <div className="grid grid-cols-2 border-b">
            <div className="p-4 bg-gray-50 font-medium border-r">
              Số lượng phương tiện
            </div>
            <div className="p-4">{apartment.vehicleCount}</div>
          </div>

          <div className="grid grid-cols-2 md:border-r">
            <div className="p-4 bg-gray-50 font-medium border-r">
              Loại phương tiện
            </div>
            <div className="p-4">
              {apartment.vehicleType
                ? getDisplayName(apartment.vehicleType, vehicleTypes)
                : "Không có"}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="p-4 bg-gray-50 font-medium border-r">Ghi chú</div>
            <div className="p-4">{apartment.note || "Không có"}</div>
          </div>
        </div>
      </div>

      {/* Thông tin khác */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Thông tin khác</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border rounded-md">
          <div className="grid grid-cols-2 border-b md:border-r">
            <div className="p-4 bg-gray-50 font-medium border-r">Người tạo</div>
            <div className="p-4">{apartment.createdBy}</div>
          </div>
          <div className="grid grid-cols-2 border-b">
            <div className="p-4 bg-gray-50 font-medium border-r">Ngày tạo</div>
            <div className="p-4">{apartment.createdAt}</div>
          </div>

          <div className="grid grid-cols-2 md:border-r">
            <div className="p-4 bg-gray-50 font-medium border-r">
              Người cập nhật
            </div>
            <div className="p-4">{apartment.updatedBy}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="p-4 bg-gray-50 font-medium border-r">
              Ngày cập nhật
            </div>
            <div className="p-4">{apartment.updatedAt}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
