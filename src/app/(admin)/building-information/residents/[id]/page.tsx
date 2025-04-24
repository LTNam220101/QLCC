"use client";

import { use } from "react";
import Link from "next/link";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header";
import InfoRow from "@/components/common/info-row";
import { getDisplayName, roles } from "@/lib/store/use-resident-store";
import StatusBadge from "@/components/common/status-badge";
import { useResident } from "@/lib/tanstack-query/residents/queries";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Gender } from "@/enum";
import { useBuildings } from "@/lib/tanstack-query/buildings/queries";
export default function ResidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: buildings } = useBuildings();
  const { data: resident, isLoading, isError } = useResident(id);

  if (isLoading) {
    return <div className="container mx-auto p-4">Đang tải...</div>;
  }

  if (isError || !resident) {
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
    <div>
      <PageHeader
        title={
          <>
            Chi tiết cư dân
            {resident?.data?.status ? (
              <StatusBadge
                status={resident?.data?.status}
                className="ml-[14px]"
              />
            ) : null}
          </>
        }
        backUrl="/building-information/residents"
      >
        <Button className="my-[10px] rounded-md">
          <Link
            href={`/building-information/residents/${id}/edit`}
            className="flex items-center"
          >
            <Edit className="mr-2 size-4" />
            Sửa
          </Link>
        </Button>
      </PageHeader>

      {/* Thông tin chung */}
      <div className="space-y-4 mt-5 mb-[30px]">
        <h2 className="font-bold">Thông tin chung</h2>
        <div className="grid md:grid-cols-2 gap-x-10">
          <div>
            <InfoRow
              label="Số điện thoại"
              value={resident?.data?.phoneNumber}
            />
            <InfoRow
              label="Căn hộ"
              value={resident?.data?.apartment}
              highlight
            />
            <InfoRow label="Họ và tên" value={resident?.data?.fullName} />
            <InfoRow
              label="Số CMND/CCCD/Hộ chiếu"
              value={resident?.data?.identifyId}
            />
            <InfoRow
              label="Nơi cấp CMND/CCCD/Hộ chiếu"
              value={resident?.data?.identifyIssuer}
            />
            <InfoRow
              label="Vai trò"
              value={getDisplayName(resident?.data?.role, roles)}
            />
          </div>
          <div>
            <InfoRow label="Email" value={resident?.data?.email} />
            <InfoRow
              label="Tòa nhà"
              value={getDisplayName(
                resident?.data?.manageBuildingList?.[0],
                (buildings || [])?.map((building) => ({
                  id: building.buildingId,
                  name: building.buildingName,
                }))
              )}
            />
            <InfoRow
              label="Ngày sinh"
              value={
                resident?.data?.dateOfBirth &&
                format(new Date(resident?.data?.dateOfBirth), "dd/MM/yyyy", {
                  locale: vi,
                })
              }
            />
            <InfoRow
              label="Ngày cấp CMND/CCCD/Hộ chiếu"
              value={
                resident?.data?.identifyIssueDate &&
                format(
                  new Date(resident?.data?.identifyIssueDate),
                  "dd/MM/yyyy",
                  {
                    locale: vi,
                  }
                )
              }
            />
            <InfoRow
              label="Giới tính"
              value={Gender?.[resident?.data?.gender]}
            />
            <InfoRow
              label="Ngày chuyển đến"
              value={resident?.data?.moveInDate}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="font-bold">Thông tin khác</h2>
        <div className="grid md:grid-cols-2 gap-x-10">
          <div>
            <InfoRow label="Người tạo" value={resident?.data?.createBy} />
            <InfoRow label="Người cập nhật" value={resident?.data?.updateBy} />
          </div>
          <div>
            <InfoRow
              label="Ngày tạo"
              value={
                resident?.data?.createTime &&
                format(new Date(resident?.data?.createTime), "dd/MM/yyyy", {
                  locale: vi,
                })
              }
            />
            <InfoRow
              label="Ngày cập nhật"
              value={
                resident?.data?.updateTime &&
                format(new Date(resident?.data?.updateTime), "dd/MM/yyyy", {
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
