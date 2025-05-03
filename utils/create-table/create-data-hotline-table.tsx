import { Column } from "@/components/common/table-data"
import { Button } from "@/components/ui/button"
import { Edit, LockKeyhole, LockKeyholeOpen, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { vi } from "date-fns/locale"
import { Hotline } from "../../types/hotlines"

export const generateData = ({
  startIndex,
  handleDeleteClick,
  handleChangeStatus
}: {
  startIndex: number
  handleDeleteClick?: (hotline: Hotline) => void
  handleChangeStatus?: (hotline: Hotline) => void
}): Column<Hotline>[] => [
  {
    dataIndex: "index",
    name: "STT",
    render: (_, index) => startIndex + index + 1
  },
  {
    dataIndex: "name",
    name: "Tên hiển thị"
  },
  {
    dataIndex: "hotline",
    name: "Số hotline"
  },
  {
    dataIndex: "buildingName",
    name: "Toà nhà"
  },
  {
    dataIndex: "createTime",
    name: "Ngày tạo",
    render: (hotline) => {
      return hotline.createTime
        ? format(new Date(hotline.createTime), "dd/MM/yyyy", { locale: vi })
        : "-"
    }
  },
  {
    dataIndex: "status",
    name: "Trạng thái",
    render: (hotline) => (
      <Badge
        variant={hotline.status === 1 ? "green_outline" : "destructive_outline"}
      >
        {hotline.status === 1 ? "Đang hoạt động" : "Đã khóa"}
      </Badge>
    )
  },
  {
    dataIndex: "status",
    name: "Thao tác",
    render: (hotline) => (
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            handleChangeStatus?.(hotline)
          }}
        >
          {hotline.status === 1 ? (
            <LockKeyhole className="h-4 w-4" color="#194FFF" />
          ) : (
            <LockKeyholeOpen className="h-4 w-4" color="#194FFF" />
          )}
        </Button>
      </div>
    )
  }
]
