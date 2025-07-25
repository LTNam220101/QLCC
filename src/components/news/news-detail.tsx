"use client"

import { Button } from "@/components/ui/button"
import { useNews } from "@/lib/tanstack-query/news/queries"
import InfoRow from "../common/info-row"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Label } from "../ui/label"

interface NewsDetailProps {
  newsId: string
}

export function NewsDetail({ newsId }: NewsDetailProps) {
  const { data, isLoading, isError, isRefetching } = useNews(newsId)

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
      <div className="space-y-4 pt-[22px] bg-white px-8 pb-[30px]">
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-4">
          <div>
            <InfoRow label="Tiêu đề" value={data?.data?.title} />
            <InfoRow
              label="Tòa nhà"
              value={data?.data?.buildingName || data?.data?.buildingId}
            />
            <InfoRow
              label="Nội dung"
              value={
                <div dangerouslySetInnerHTML={{ __html: data?.data?.content }}></div>
              }
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
          </div>
        </div>
      </div>
      <div className="space-y-4 bg-white px-8 pb-[30px]">
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
