import { Column } from "@/components/common/table-data"
import { Button } from "@/components/ui/button"
import { EllipsisVertical } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { vi } from "date-fns/locale"
import { MovingStatus, MovingTicket } from "../../types/moving-tickets"
import { TransferType } from "@/enum"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export const generateData = ({
  startIndex,
  handleDeleteClick,
  handleChangeStatus
}: {
  startIndex: number
  handleDeleteClick?: (movingTicket: MovingTicket) => void
  handleChangeStatus?: (movingTicket: MovingTicket, status: number) => void
}): Column<MovingTicket>[] => [
  {
    dataIndex: "index",
    name: "STT",
    render: (_, index) => startIndex + index + 1
  },
  {
    dataIndex: "ticketCode",
    name: "Mã đăng ký",
    render: (movingTicket) => movingTicket?.ticketCode?.split("-")?.at(-1)
  },
  {
    dataIndex: "transferType",
    name: "Hình thức",
    render: (movingTicket) => TransferType?.[movingTicket.transferType]
  },
  {
    dataIndex: "movingDayTime",
    name: "Ngày chuyển đồ",
    render: (movingTicket) => {
      return movingTicket.createTime
        ? format(new Date(movingTicket.movingDayTime), "dd/MM/yyyy", {
            locale: vi
          })
        : "-"
    }
  },
  {
    dataIndex: "buildingName",
    name: "Toà nhà"
  },
  {
    dataIndex: "apartmentName",
    name: "Căn hộ"
  },
  {
    dataIndex: "createBy",
    name: "Người tạo"
  },
  {
    dataIndex: "createTime",
    name: "Ngày tạo",
    render: (movingTicket) => {
      return movingTicket.createTime
        ? format(new Date(movingTicket.createTime), "dd/MM/yyyy", {
            locale: vi
          })
        : "-"
    }
  },
  {
    dataIndex: "status",
    name: "Trạng thái",
    render: (movingTicket) => {
      const color = `${MovingStatus?.[movingTicket?.status]?.color}_outline`
      const statusName = MovingStatus?.[movingTicket?.status]?.name
      return <Badge variant={color as any}>{statusName}</Badge>
    }
  },
  {
    dataIndex: "status",
    name: "Thao tác",
    render: (movingTicket) => (
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <EllipsisVertical className="h-4 w-4" color="#194FFF" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleDeleteClick?.(movingTicket)}>
              Xoá
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleChangeStatus?.(movingTicket, 1)}
            >
              Phê duyệt
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleChangeStatus?.(movingTicket, -2)}
            >
              Từ chối
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleChangeStatus?.(movingTicket, 2)}
            >
              Xác nhận chuyển đồ
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleChangeStatus?.(movingTicket, 3)}
            >
              Hoàn thành
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
]
