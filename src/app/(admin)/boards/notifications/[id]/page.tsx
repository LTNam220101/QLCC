"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { NotificationDetail } from "@/components/notification/notification-detail"
import { Edit } from "lucide-react"
import PageHeader from "@/components/common/page-header"
import { use } from "react"
import { Badge } from "@/components/ui/badge"
import { useNotification } from "@/lib/tanstack-query/notifications/queries"

interface NotificationDetailPageProps {
  params: Promise<{ id: string }>
}

export default function NotificationDetailPage({
  params
}: NotificationDetailPageProps) {
  const { id } = use(params)
  const { data: notification } = useNotification(id)

  return (
    <div>
      <PageHeader
        title={
          <>
            Chi tiết thông báo
            {notification?.data && (
              <Badge
                variant={
                  notification?.data?.status === 1
                    ? "gray_outline"
                    : "green_outline"
                }
                className="ml-3"
              >
                {notification?.data?.status === 1 ? "Đã gửi" : "Đã lưu"}
              </Badge>
            )}
          </>
        }
        backUrl="/boards/notifications"
      >
        <Button className="my-[10px] rounded-md">
          <Link
            href={`/boards/notifications/${id}/edit`}
            className="flex items-center"
          >
            <Edit className="mr-2 size-4" />
            Sửa
          </Link>
        </Button>
      </PageHeader>
      <NotificationDetail notificationId={id} />
    </div>
  )
}
