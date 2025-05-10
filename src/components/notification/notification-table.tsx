"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useNotificationFilterStore } from "@/lib/store/use-notification-filter-store"
import {
  useNotifications,
  useDeleteNotification
} from "@/lib/tanstack-query/notifications/queries"
import { toast } from "sonner"
import { generateData } from "../../../utils/create-table/create-data-notification-table"
import TableData from "../common/table-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog"
import { Notification } from "../../../types/notifications"
import { useRouter } from "next/navigation"

export function NotificationTable() {
  const router = useRouter()
  const { filter, setFilter, resetFilter } = useNotificationFilterStore()
  const { data, isLoading, isError, isRefetching } = useNotifications(filter)
  const deleteNotificationMutation = useDeleteNotification()

  const [notificationToDelete, setNotificationToDelete] =
    useState<Notification | null>(null)

  // Xử lý xóa notification
  const handleDelete = async () => {
    if (!notificationToDelete) return

    try {
      await deleteNotificationMutation.mutateAsync(
        notificationToDelete.notificationManagementId
      )
      toast(`Đã xóa notification`)
      setNotificationToDelete(null)
    } catch (error) {
      toast("Đã xảy ra lỗi khi xóa notification")
    }
  }

  const columns = generateData({
    startIndex: filter?.size * filter?.page || 0,
    handleDeleteClick: (notification) => {
      setNotificationToDelete(notification)
    }
  })

  // Render lỗi
  if (isError) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-red-500 mb-2">Đã xảy ra lỗi khi tải dữ liệu</p>
          <Button onClick={() => window.location.reload()}>Tải lại</Button>
        </div>
      </div>
    )
  }
  // Render khi không có dữ liệu
  if (data?.data?.data.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Không có dữ liệu</p>
          <Button onClick={resetFilter}>Đặt lại bộ lọc</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <TableData<Notification>
        datas={data?.data?.data}
        columns={columns}
        isLoading={isLoading || isRefetching}
        filters={filter}
        setFilter={setFilter}
        recordsTotal={data?.data?.recordsTotal}
        onClickRow={(_, notification)=>{
          router.push(`/boards/notifications/${notification.notificationManagementId}`)
        }}
      />

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={!!notificationToDelete}
        onOpenChange={(open) => !open && setNotificationToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa notification</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa notification{" "}
              {`${notificationToDelete?.title}`}? Hành động này không thể hoàn
              tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNotificationToDelete(null)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
