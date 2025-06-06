"use client"

import { use, useState } from "react"
import Link from "next/link"
import Edit from "@/icons/edit.svg"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/common/page-header"
import InfoRow from "@/components/common/info-row"
import StatusBadge from "@/components/common/status-badge"
import { useResident } from "@/lib/tanstack-query/residents/queries"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Gender } from "@/enum"
import TableData from "@/components/common/table-data"
import { generateData } from "../../../../../../utils/create-table/create-data-user-apartment-table2"
import { useUserApartments } from "@/lib/tanstack-query/user-apartments/queries"

export default function ResidentDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: resident, isLoading, isError, isRefetching } = useResident(id)

  const [filters, setFilters] = useState({
    page: 0,
    size: 10
  })
  const { data } = useUserApartments({
    ...filters,
    userPhone: resident?.data?.phoneNumber
  })
  const columns = generateData({
    startIndex: 0
  })

  const setFilter = (arg0: Record<string, any>) => {
    setFilters({ ...filters, ...arg0 })
  }

  if (isLoading) {
    return <div className="container mx-auto p-4">Đang tải...</div>
  }

  if (isError || !resident) {
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
    <div className="flex flex-col h-full">
      <PageHeader
        title={
          <>
            Chi tiết cư dân
            {resident?.data?.status ? (
              <StatusBadge status={resident?.data?.status} className="ml-2" />
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
            <Edit className="mr-2 size-5" />
            Chỉnh sửa
          </Link>
        </Button>
      </PageHeader>

      {/* Thông tin chung */}
      <div className="space-y-4 pt-[22px] bg-white px-8 pb-4">
        <h2 className="font-bold">Thông tin chung</h2>
        <div className="grid md:grid-cols-2 gap-x-10">
          <div>
            <InfoRow
              label="Số điện thoại"
              value={resident?.data?.phoneNumber}
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
          </div>
          <div>
            <InfoRow label="Email" value={resident?.data?.email} />
            <InfoRow
              label="Ngày sinh"
              value={
                resident?.data?.dateOfBirth &&
                format(new Date(resident?.data?.dateOfBirth), "dd/MM/yyyy", {
                  locale: vi
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
                    locale: vi
                  }
                )
              }
            />
            <InfoRow
              label="Giới tính"
              value={Gender?.[resident?.data?.gender]}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4 bg-white px-8 pb-4">
        <h2 className="font-bold">Danh sách căn hộ liên kết</h2>
        <TableData
          columns={columns}
          datas={data?.data?.data}
          isLoading={isLoading || isRefetching}
          filters={filters}
          setFilter={setFilter}
          recordsTotal={data?.data?.recordsTotal}
        />
      </div>
      <div className="space-y-4 bg-white px-8 pb-[30px]">
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
                  locale: vi
                })
              }
            />
            <InfoRow
              label="Ngày cập nhật"
              value={
                resident?.data?.updateTime &&
                format(new Date(resident?.data?.updateTime), "dd/MM/yyyy", {
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
