import { Column } from "@/components/common/table-data"
import { Button } from "@/components/ui/button"
import { EllipsisVertical, ScanSearch } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Report, ReportStatus } from "../../types/reports"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
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
  handleDeleteClick?: (report: Report) => void
  handleChangeStatus?: (report: Report, status: number) => void
}): Column<Report>[] => [
    {
      dataIndex: "index",
      name: "STT",
      render: (_, index) => startIndex + index + 1
    },
    {
      dataIndex: "reportCode",
      name: "Mã phản ánh",
    },
    {
      dataIndex: "reportContent",
      name: "Nội dung",
      className: "max-w-[400px] overflow-hidden"
    },
    {
      dataIndex: "buildingName",
      name: "Toà nhà",
      textAlign: 'text-center'
    },
    {
      dataIndex: "apartmentName",
      name: "Căn hộ",
      textAlign: 'text-center'
    },
    {
      dataIndex: "note",
      name: "Ghi chú",
      className: "max-w-[400px] overflow-hidden"
    },
    {
      dataIndex: "createTime",
      name: "Ngày tạo",
      render: (hotline) => {
        return hotline.createTime
          ? format(new Date(hotline.createTime), "dd/MM/yyyy", { locale: vi })
          : "-"
      },
      textAlign: "text-center"
    },
    {
      dataIndex: "status",
      name: "Trạng thái",
      render: (report) => {
        const color = `${ReportStatus?.[report?.status]?.color}_outline`
        const statusName = ReportStatus?.[report?.status]?.name

        return <Badge variant={color as any}>{statusName}</Badge>
      }
    },
    {
      dataIndex: "status",
      name: "Thao tác",
      render: (report) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {(report?.status === 0 || report?.status === 1 || report?.status === 2) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <EllipsisVertical className="h-4 w-4" color="#194FFF" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {report?.status === 1 && (
                  <>
                    <DropdownMenuItem onClick={() => handleChangeStatus?.(report, 2)}>
                      Xác nhận xử lý
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleChangeStatus?.(report, 0)}>
                      Từ chối
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick?.(report)}>
                      Xoá
                    </DropdownMenuItem>
                  </>
                )}
                {report?.status === 2 && (
                  <>
                    <DropdownMenuItem onClick={() => handleChangeStatus?.(report, 3)}>
                      Hoàn thành
                    </DropdownMenuItem>
                  </>
                )}
                {report?.status === 0 && (
                  <>
                    <DropdownMenuItem onClick={() => handleChangeStatus?.(report, 0)}>
                      Xoá
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}</div>
      )
    }
  ]
