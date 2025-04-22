import { Column } from "@/components/common/table-data";
import { Button } from "@/components/ui/button";
import { Edit, LockKeyhole, LockKeyholeOpen, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Report } from "../../types/reports";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const generateData = ({
  handleDeleteClick,
  handleChangeStatus,
}: {
  handleDeleteClick?: (report: Report) => void;
  handleChangeStatus?: (report: Report, status: number) => void;
}): Column<Report>[] => [
  {
    dataIndex: "index",
    name: "STT",
    render: (_, index) => index + 1,
  },
  {
    dataIndex: "reportId",
    name: "Mã phản ánh",
    render: (report) => report?.reportId?.split("-")?.at(-1),
  },
  {
    dataIndex: "reportContent",
    name: "Nội dung",
  },
  {
    dataIndex: "buildingName",
    name: "Căn hộ",
  },
  {
    dataIndex: "buildingName",
    name: "Toà nhà",
  },
  {
    dataIndex: "note",
    name: "Ghi chú",
  },
  {
    dataIndex: "createTime",
    name: "Ngày tạo",
    render: (hotline) => {
      return hotline.createTime
        ? format(new Date(hotline.createTime), "dd/MM/yyyy", { locale: vi })
        : "-";
    },
  },
  {
    dataIndex: "status",
    name: "Trạng thái",
    render: (report) => (
      <Badge
        variant={report.status === 1 ? "green_outline" : "destructive_outline"}
      >
        {report.status === 1 ? "Đang hoạt động" : "Đã khóa"}
      </Badge>
    ),
  },
  {
    dataIndex: "status",
    name: "Thao tác",
    render: (report) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            handleChangeStatus?.(report);
          }}
        >
          {report.status === 1 ? (
            <LockKeyhole className="h-4 w-4" color="#194FFF" />
          ) : (
            <LockKeyholeOpen className="h-4 w-4" color="#194FFF" />
          )}
        </Button>
        <Link href={`/services/reports/${report.reportId}/edit`}>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" color="#194FFF" />
          </Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleDeleteClick?.(report)}
        >
          <Trash2 className="h-4 w-4" color="#FE0000" />
        </Button>
      </div>
    ),
  },
];
