"use client"
import InfoRow from "../common/info-row"
import { getDisplayName } from "@/lib/store/use-resident-store"
import { useUserApartment } from "@/lib/tanstack-query/user-apartments/queries"
import { Button } from "../ui/button"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useBuildings } from "@/lib/tanstack-query/buildings/queries"
import { useApartments } from "@/lib/tanstack-query/apartments/queries"

interface UserApartmentDetailProps {
  userApartmentId: string
}

export function UserApartmentDetail({ userApartmentId }: UserApartmentDetailProps) {
  const { data, isLoading, isError, isRefetching } =
    useUserApartment(userApartmentId)
  const { data: buildings } = useBuildings()
  const { data: apartments } = useApartments(
    {
      manageBuildingList: [data?.data?.buildingId!],
      page: 0,
      size: 1000
    },
    !!data?.data?.buildingId?.[0]
  )

  if (isLoading) {
    return <div className="container mx-auto p-4">Đang tải...</div>
  }

  if (isError || !data) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-red-500 mb-2">Đã xảy ra lỗi khi tải dữ liệu</p>
          <Button onClick={() => window.location.reload()}>Tải lại</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 mt-5 mb-[30px]">
      <h2 className="font-bold">Thông tin chung</h2>
      <div className="grid md:grid-cols-2 gap-x-10">
        <div>
          <InfoRow label="Số điện thoại" value={data?.data?.userPhone} />
          <InfoRow
            label="Tòa nhà"
            value={getDisplayName(
              data?.data?.buildingName,
              (buildings || [])?.map((building) => ({
                id: building.buildingId,
                name: building.buildingName
              }))
            )}
          />
          <InfoRow
            label="Vai trò"
            value={data?.data?.userApartmentRole || "-"}
          />
          <InfoRow label="Ghi chú" value={data?.data?.note || "-"} />
        </div>
        <div>
          <InfoRow label="Họ và tên" value={data?.data?.fullName || "-"} />
          <InfoRow
            label="Căn hộ"
            value={getDisplayName(
              data?.data?.buildingName,
              (apartments?.data?.data || [])?.map((apartment) => ({
                id: apartment.id,
                name: apartment.apartmentName
              }))
            )}
          />
          {/* <InfoRow label="Ngày chuyển đến" value={
                data?.data?.movingDayTime &&
                format(new Date(data?.data?.movingDayTime), "dd/MM/yyyy", {
                  locale: vi,
                })
              } /> */}
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
                  locale: vi
                })
              }
            />
            <InfoRow
              label="Ngày cập nhật"
              value={
                data?.data?.updateTime &&
                format(new Date(data?.data?.updateTime), "dd/MM/yyyy", {
                  locale: vi
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
