import { Column } from "@/components/common/table-data"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { vi } from "date-fns/locale"
import { Notification } from "../../types/notifications"

export const generateData = ({
  startIndex,
  handleDeleteClick
}: {
  startIndex: number
  handleDeleteClick?: (notification: Notification) => void
}): Column<Notification>[] => [
  {
    dataIndex: "index",
    name: "STT",
    render: (_, index) => startIndex + index + 1
  },
  {
    dataIndex: "title",
    name: "Tiêu đề thông báo"
  },
  {
    dataIndex: "content",
    name: "Nội dung thông báo",
    render: (notification) => {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: notification?.content }}
          className="line-clamp-2"
        />
      )
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
    dataIndex: "sentTime",
    name: "Ngày gửi",
    render: (notification) => {
      return notification.sentTime
        ? format(new Date(notification.sentTime), "dd/MM/yyyy hh:mm aa", {
            locale: vi
          })
        : "-"
    }
  },
  {
    dataIndex: "createTime",
    name: "Ngày tạo",
    render: (notification) => {
      return notification.createTime
        ? format(new Date(notification.createTime), "dd/MM/yyyy", {
            locale: vi
          })
        : "-"
    }
  },
  {
    dataIndex: "status",
    name: "Trạng thái",
    render: (notification) => (
      <Badge
        variant={notification?.status === 1 ? "gray_outline" : "green_outline"}
      >
        {notification?.status === 1 ? "Đã lưu" : "Đã gửi"}
      </Badge>
    )
  },
  {
    dataIndex: "status",
    name: "Thao tác",
    render: (notification) => (
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        {notification?.status === 1 ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDeleteClick?.(notification)}
          >
            <Trash2 className="h-4 w-4" color="#FE0000" />
          </Button>
        ) : null}
      </div>
    )
  }
]
