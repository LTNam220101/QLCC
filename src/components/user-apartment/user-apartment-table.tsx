"use client"

import { Button } from "@/components/ui/button"
import { useUserApartmentStore } from "@/lib/store/use-user-apartment-store"
import TableData from "../common/table-data"
import { generateData } from "../../../utils/create-table/create-data-user-apartment-table"
import {
  useRejectUserApartment,
  useUnlinkUserApartment,
  useUpdateUserApartment,
  useUserApartments,
  useVerifyUserApartment
} from "@/lib/tanstack-query/user-apartments/queries"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog"
import { UserApartment } from "../../../types/user-apartments"
import { useState } from "react"
import { toast } from "sonner"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Input } from "../ui/input"

export function UserApartmentTable() {
  const router = useRouter()
  const { filters, setFilter, clearFilters } = useUserApartmentStore()
  const [rejectReason, setRejectReason] = useState("")

  const { data, isLoading, isError, isRefetching } = useUserApartments(filters)
  const verifyUserApartmentMutation = useVerifyUserApartment()
  const rejectUserApartmentMutation = useRejectUserApartment()
  const unlinkUserApartmentMutation = useUnlinkUserApartment()

  const [userApartmentToUpdate, setUserApartmentToUpdate] = useState<{
    userApartment: UserApartment
    newStatus: number
  } | null>(null)

  const handleUpdateClick = (userApartment: UserApartment, status: number) => {
    setUserApartmentToUpdate({ userApartment, newStatus: status })
  }

  const confirmUpdate = async () => {
    if (!userApartmentToUpdate) return

    try {
      if (userApartmentToUpdate?.newStatus === 1) {
        await verifyUserApartmentMutation.mutateAsync({
          id: userApartmentToUpdate?.userApartment?.userApartmentMappingId
        })
      } else if (userApartmentToUpdate?.newStatus === 0) {
        await unlinkUserApartmentMutation.mutateAsync({
          id: userApartmentToUpdate?.userApartment?.userApartmentMappingId,
          data: {
            rejectReason
          }
        })
      } else if (userApartmentToUpdate?.newStatus === -1) {
        await rejectUserApartmentMutation.mutateAsync({
          id: userApartmentToUpdate?.userApartment?.userApartmentMappingId,
          data: {
            rejectReason
          }
        })
      }
      toast(`Đã cập nhật liên kết`)
      setRejectReason("")
      setUserApartmentToUpdate(null)
    } catch (error) {
      toast("Đã xảy ra lỗi khi cập nhật liên kết")
    }
  }

  const columns = generateData({
    startIndex: filters?.size * filters?.page || 0,
    handleUpdateClick
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
          <Button onClick={clearFilters}>Đặt lại bộ lọc</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Danh sách căn hộ */}
      <TableData
        columns={columns}
        datas={data?.data?.data}
        isLoading={isLoading || isRefetching}
        filters={filters}
        setFilter={setFilter}
        recordsTotal={data?.data?.recordsTotal}
        onClickRow={(_, userApartment) => {
          router.push(
            `/building-information/links/${userApartment.userApartmentMappingId}`
          )
        }}
      />
      <Dialog
        open={!!userApartmentToUpdate}
        onOpenChange={(open) => !open && setUserApartmentToUpdate(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận thay đổi trạng thái liên kết</DialogTitle>
            <DialogDescription>
              {userApartmentToUpdate?.newStatus === 1
                ? "Bạn có chắc chắn muốn phê duyệt?"
                : null}
            </DialogDescription>
            {userApartmentToUpdate?.newStatus === 0 ? (
              <>
                <Label className="after:content-['*'] after:text-red-500 after:ml-0.5">
                  Vui lòng nhập lý do
                </Label>
                <Input
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value.trim())}
                />
              </>
            ) : null}
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUserApartmentToUpdate(null)}
            >
              Hủy
            </Button>
            <Button
              disabled={userApartmentToUpdate?.newStatus === 0 && !rejectReason}
              onClick={confirmUpdate}
              variant={
                userApartmentToUpdate?.newStatus === 1 ? "default" : "warning"
              }
            >
              {userApartmentToUpdate?.newStatus === 1 ? "Đồng ý" : "Từ chối"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
