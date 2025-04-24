import { Column } from "@/components/common/table-data";
import { Button } from "@/components/ui/button";
import { Edit, LockKeyhole, LockKeyholeOpen, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { vi } from "date-fns/locale";
import { MovingTicket } from "../../types/moving-tickets";
import { TransferType } from "@/enum";

export const generateData = ({
  startIndex,
  handleDeleteClick,
  handleChangeStatus,
}: {
  startIndex: number;
  handleDeleteClick?: (movingTicket: MovingTicket) => void;
  handleChangeStatus?: (movingTicket: MovingTicket, status: number) => void;
}): Column<MovingTicket>[] => [
  {
    dataIndex: "index",
    name: "STT",
    render: (_, index) => startIndex + index + 1,
  },
  {
    dataIndex: "ticketCode",
    name: "Mã đăng ký",
    render: (movingTicket) => movingTicket?.ticketCode?.split("-")?.at(-1),
  },
  {
    dataIndex: "transferType",
    name: "Hình thức",
    render: (movingTicket) => TransferType?.[movingTicket.transferType],
  },
  {
    dataIndex: "movingDayTime",
    name: "Ngày chuyển đồ",
    render: (movingTicket) => {
      return movingTicket.createTime
        ? format(new Date(movingTicket.movingDayTime), "dd/MM/yyyy", {
            locale: vi,
          })
        : "-";
    },
  },
  {
    dataIndex: "buildingName",
    name: "Toà nhà",
  },
  {
    dataIndex: "apartmentName",
    name: "Căn hộ",
  },
  {
    dataIndex: "createBy",
    name: "Người tạo",
  },
  {
    dataIndex: "createTime",
    name: "Ngày tạo",
    render: (movingTicket) => {
      return movingTicket.createTime
        ? format(new Date(movingTicket.createTime), "dd/MM/yyyy", {
            locale: vi,
          })
        : "-";
    },
  },
  {
    dataIndex: "status",
    name: "Trạng thái",
    render: (movingTicket) => (
      <Badge
        variant={
          movingTicket.status === 1 ? "green_outline" : "destructive_outline"
        }
      >
        {movingTicket.status === 1 ? "Đang hoạt động" : "Đã khóa"}
      </Badge>
    ),
  },
  {
    dataIndex: "status",
    name: "Thao tác",
    render: (movingTicket) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            handleChangeStatus?.(movingTicket, 0);
          }}
        >
          {movingTicket.status === 1 ? (
            <LockKeyhole className="h-4 w-4" color="#194FFF" />
          ) : (
            <LockKeyholeOpen className="h-4 w-4" color="#194FFF" />
          )}
        </Button>
        {/* <Link href={`/services/moving-tickets/${movingTicket.ticketId}/edit`}>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" color="#194FFF" />
          </Button>
        </Link> */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleDeleteClick?.(movingTicket)}
        >
          <Trash2 className="h-4 w-4" color="#FE0000" />
        </Button>
      </div>
    ),
  },
];
