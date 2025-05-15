import { Column } from "@/components/common/table-data"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { vi } from "date-fns/locale"
import { News } from "../../types/news"

export const generateData = ({
  startIndex,
  handleDeleteClick
}: {
  startIndex: number
  handleDeleteClick?: (news: News) => void
}): Column<News>[] => [
  {
    dataIndex: "index",
    name: "STT",
    render: (_, index) => startIndex + index + 1
  },
  {
    dataIndex: "title",
    name: "Tiêu đề"
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
    render: (news) => {
      return news.sentTime
        ? format(new Date(news.sentTime), "dd/MM/yyyy hh:mm aa", {
            locale: vi
          })
        : "-"
    }
  },
  {
    dataIndex: "createTime",
    name: "Ngày tạo",
    render: (news) => {
      return news.createTime
        ? format(new Date(news.createTime), "dd/MM/yyyy", {
            locale: vi
          })
        : "-"
    }
  },
  {
    dataIndex: "status",
    name: "Trạng thái",
    render: (news) => (
      <Badge
        variant={news?.status === 0 ? "gray_outline" : "green_outline"}
      >
        {news?.status === 0 ? "Đã lưu" : "Đã gửi"}
      </Badge>
    )
  },
  {
    dataIndex: "status",
    name: "Thao tác",
    render: (news) => (
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        {news?.status === 1 ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDeleteClick?.(news)}
          >
            <Trash2 className="h-4 w-4" color="#FE0000" />
          </Button>
        ) : null}
      </div>
    )
  }
]
