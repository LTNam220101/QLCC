"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useMovingTicketFilterStore } from "@/lib/store/use-moving-ticket-filter-store"
import {
  useMovingTickets,
  useDeleteMovingTicket,
  useUpdateMovingTicket
} from "@/lib/tanstack-query/moving-tickets/queries"
import { toast } from "sonner"
import { generateData } from "../../../utils/create-table/create-data-moving-ticket-table"
import TableData from "../common/table-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog"
import { MovingTicket } from "../../../types/moving-tickets"
import { useRouter } from "next/navigation"

export function MovingTicketTable() {
  const router = useRouter()
  const { filter, setFilter, resetFilter } = useMovingTicketFilterStore()
  const { data, isLoading, isError, isRefetching } = useMovingTickets(filter)
  const deleteMovingTicketMutation = useDeleteMovingTicket()
  const updateMovingTicketMutation = useUpdateMovingTicket()
  const [typeUpdate, setTypeUpdate] = useState<number | undefined>(undefined)
  const [movingTicketToDelete, setMovingTicketToDelete] =
    useState<MovingTicket | null>(null)

  const [movingTicketToUpdateStatus, setMovingTicketToUpdateStatus] =
    useState<MovingTicket | null>(null)

  // Xử lý xóa movingTicket
  const handleDelete = async () => {
    if (!movingTicketToDelete) return

    try {
      await deleteMovingTicketMutation.mutateAsync(
        movingTicketToDelete.ticketId
      )
      toast(`Đã xóa yêu cầu`)
      setMovingTicketToDelete(null)
    } catch (error) {
      toast("Đã xảy ra lỗi khi xóa yêu cầu")
    }
  }
  // Xử lý đổi status movingTicket
  const handleUpdateStatus = async (status: number) => {
    if (!movingTicketToUpdateStatus) return
    try {
      await updateMovingTicketMutation.mutateAsync({
        ...movingTicketToUpdateStatus,
        status: status
      })
      toast(`Đã đổi trạng thái yêu cầu`)
      setMovingTicketToUpdateStatus(null)
    } catch (error) {
      toast(`Đã xảy ra lỗi khi đổi trạng thái`)
    }
  }

  const columns = generateData({
    startIndex: filter?.size * filter?.page || 0,
    handleDeleteClick: (movingTicket) => {
      setMovingTicketToDelete(movingTicket)
    },
    handleChangeStatus: (movingTicket, status) => {
      setMovingTicketToUpdateStatus(movingTicket)
      setTypeUpdate(status)
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
    <div className="mt-[22px] bg-white rounded-lg px-8 flex-1">
      <div className="text-lg font-semibold text-[#303438] my-[16.5px]">Danh sách</div>
      <TableData<MovingTicket>
        datas={data?.data?.data}
        columns={columns}
        isLoading={isLoading || isRefetching}
        filters={filter}
        setFilter={setFilter}
        recordsTotal={data?.data?.recordsTotal}
        onClickRow={(_, movingTicket)=>{
          router.push(`/services/moving-tickets/${movingTicket.ticketId}`)
        }}
      />

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={!!movingTicketToDelete}
        onOpenChange={(open) => !open && setMovingTicketToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa yêu cầu</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa yêu cầu? Hành động này không thể hoàn
              tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMovingTicketToDelete(null)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận update status */}
      <Dialog
        open={!!movingTicketToUpdateStatus}
        onOpenChange={(open) => !open && setMovingTicketToUpdateStatus(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận đổi trạng thái yêu cầu</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn đổi trạng thái yêu cầu
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMovingTicketToUpdateStatus(null)}
            >
              Hủy
            </Button>
            <Button onClick={() => handleUpdateStatus(typeUpdate!)}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
