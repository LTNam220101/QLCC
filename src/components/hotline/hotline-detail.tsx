"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useHotline } from "@/lib/tanstack-query/hotlines/queries"

interface HotlineDetailProps {
  hotlineId: number
}

export function HotlineDetail({ hotlineId }: HotlineDetailProps) {
  const router = useRouter()
  const { data: hotline, isLoading, isError } = useHotline(hotlineId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">Số hotline</p>
            <Skeleton className="h-6 w-40" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Tên hiển thị</p>
            <Skeleton className="h-6 w-40" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Tòa nhà</p>
            <Skeleton className="h-6 w-32" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Trạng thái</p>
            <Skeleton className="h-6 w-28" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Ghi chú</p>
          <Skeleton className="h-24 w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">Người tạo</p>
            <Skeleton className="h-6 w-32" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Ngày tạo</p>
            <Skeleton className="h-6 w-32" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Người cập nhật</p>
            <Skeleton className="h-6 w-32" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Ngày cập nhật</p>
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !hotline) {
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-sm font-medium">Số hotline</p>
          <p className="text-lg">{hotline.phoneNumber}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Tên hiển thị</p>
          <p className="text-lg">{hotline.name}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Tòa nhà</p>
          <p className="text-lg">{hotline.buildingName}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Trạng thái</p>
          <Badge
            variant={hotline.status === "active" ? "default" : "destructive"}
            className="capitalize"
          >
            {hotline.status === "active" ? "Đang hoạt động" : "Đã khóa"}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Ghi chú</p>
        <div className="p-4 border rounded-md min-h-[100px] bg-muted/30">
          {hotline.note || (
            <span className="text-muted-foreground italic">
              Không có ghi chú
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-sm font-medium">Người tạo</p>
          <p>{hotline.createdBy}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Ngày tạo</p>
          <p>
            {format(new Date(hotline.createdAt), "dd/MM/yyyy HH:mm", {
              locale: vi
            })}
          </p>
        </div>

        {hotline.updatedBy && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Người cập nhật</p>
            <p>{hotline.updatedBy}</p>
          </div>
        )}

        {hotline.updatedAt && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Ngày cập nhật</p>
            <p>
              {format(new Date(hotline.updatedAt), "dd/MM/yyyy HH:mm", {
                locale: vi
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
