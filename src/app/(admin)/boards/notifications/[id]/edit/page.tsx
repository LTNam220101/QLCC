"use client"

import { NotificationForm } from "@/components/notification/notification-form"
import PageHeader from "@/components/common/page-header"
import { use } from "react"
import { Badge } from "@/components/ui/badge"
import { useNotification } from "@/lib/tanstack-query/notifications/queries"

interface EditNotificationPageProps {
  params: Promise<{ id: string }>
}

export default function EditNotificationPage({
  params
}: EditNotificationPageProps) {
  const { id } = use(params)
  const { data: notification } = useNotification(id)

  return (
    <div>
      <PageHeader
        title={
          <>
            Sửa thông báo
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
        backUrl={`/boards/notifications/${id}`}
      />
      <NotificationForm notificationId={id} isEdit />
    </div>
  )
}
