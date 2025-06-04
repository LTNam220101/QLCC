"use client"

import { Button } from "@/components/ui/button"
import { useNotification } from "@/lib/tanstack-query/notifications/queries"
import InfoRow from "../common/info-row"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { MinimalTiptapEditor } from "../minimal-tiptap"
import { Label } from "../ui/label"

interface NotificationDetailProps {
  notificationId: string
}

export function NotificationDetail({
  notificationId
}: NotificationDetailProps) {
  const { data, isLoading, isError, isRefetching } = useNotification(notificationId)

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
    <>
      <div className="mt-[22px] bg-white rounded-lg px-8 flex-1 mb-[30px]">
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-4">
          <div>
            <InfoRow label="Tiêu đề" value={data?.data?.title} />
            <InfoRow
              className="col-span-2"
              label="Căn hộ"
              value={data?.data?.apartmentName || data?.data?.apartmentId}
            />
          </div>
          <div>
            <InfoRow
              label="Thời gian gửi"
              value={
                data?.data?.sentTime &&
                format(new Date(data?.data?.sentTime), "dd/MM/yyyy hh:mm aa", {
                  locale: vi
                })
              }
            />
            <InfoRow
              label="Tòa nhà"
              value={data?.data?.buildingName || data?.data?.buildingId}
            />
          </div>
          <div className="col-span-2">
            <Label className="mb-2 text-md">Nội dung</Label>
            <div
              dangerouslySetInnerHTML={{ __html: data?.data?.content }}
              className="border-[#D9D9D9] bg-[#F5F5F5] border rounded p-3"
            />
          </div>
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
    </>
  )
}
